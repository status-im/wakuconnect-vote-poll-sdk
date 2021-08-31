import { expect, use } from 'chai'
import { loadFixture, deployContract, MockProvider, solidity } from 'ethereum-waffle'
import { VotingContract, ERC20Mock } from '../abi'
import { utils, Wallet, Contract } from 'ethers'
import { signTypedMessage, TypedMessage } from 'eth-sig-util'
import { BigNumber } from '@ethersproject/bignumber'

use(solidity)

interface MessageTypeProperty {
  name: string
  type: string
}
interface MessageTypes {
  EIP712Domain: MessageTypeProperty[]
  [additionalProperties: string]: MessageTypeProperty[]
}

const typedData = {
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    Vote: [
      { name: 'roomIdAndType', type: 'uint256' },
      { name: 'tokenAmount', type: 'uint256' },
      { name: 'voter', type: 'address' },
    ],
  },
  primaryType: 'Vote',
  domain: {
    name: 'Voting Contract',
    version: '1',
    chainId: 0,
    verifyingContract: '',
  },
}

const getSignedMessages = async (
  alice: Wallet,
  firstAddress: Wallet,
  secondAddress: Wallet
): Promise<{ messages: any[]; signedMessages: any[] }> => {
  const votes = [
    {
      voter: alice,
      vote: 1,
      tokenAmount: BigNumber.from(100),
      sessionID: 0,
    },
    {
      voter: firstAddress,
      vote: 0,
      tokenAmount: BigNumber.from(100),
      sessionID: 0,
    },
    {
      voter: secondAddress,
      vote: 1,
      tokenAmount: BigNumber.from(100),
      sessionID: 0,
    },
  ]
  const types = ['address', 'uint256', 'uint256']
  const messages = votes.map((vote) => {
    return [vote.voter.address, BigNumber.from(vote.sessionID).mul(2).add(vote.vote), vote.tokenAmount] as [
      string,
      BigNumber,
      BigNumber
    ]
  })
  const signedMessages = messages.map((msg, idx) => {
    const t: TypedMessage<MessageTypes> = {
      ...typedData,
      message: { roomIdAndType: msg[1].toHexString(), tokenAmount: msg[2].toHexString(), voter: msg[0] },
    }
    const sig = utils.splitSignature(
      signTypedMessage(Buffer.from(utils.arrayify(votes[idx].voter.privateKey)), { data: t }, 'V3')
    )
    return [...msg, sig.r, sig._vs]
  })

  return { messages, signedMessages }
}

async function fixture([alice, firstAddress, secondAddress]: any[], provider: any) {
  const erc20 = await deployContract(alice, ERC20Mock, ['MSNT', 'Mock SNT', alice.address, 100000])
  await erc20.transfer(firstAddress.address, 10000)
  await erc20.transfer(secondAddress.address, 10000)
  const contract = await deployContract(alice, VotingContract, [erc20.address])
  await provider.send('evm_mine', [Math.floor(Date.now() / 1000)])
  return { contract, alice, firstAddress, secondAddress, provider }
}
before(async () => {
  const { contract } = await loadFixture(fixture)
  typedData.domain.chainId = 1
  typedData.domain.verifyingContract = contract.address
})

describe('Contract', () => {
  describe('Voting Room', () => {
    describe('initialization', () => {
      it('initializes', async () => {
        const { contract } = await loadFixture(fixture)

        await expect(await contract.initializeVotingRoom('test', 'short desc', BigNumber.from(100)))
          .to.emit(contract, 'VotingRoomStarted')
          .withArgs(0, 'test')
        await expect(await contract.initializeVotingRoom('test2', 'short desc', BigNumber.from(100)))
          .to.emit(contract, 'VotingRoomStarted')
          .withArgs(1, 'test2')
      })

      it('not enough token', async () => {
        const { contract } = await loadFixture(fixture)
        await expect(
          contract.initializeVotingRoom('test', 'short desc', BigNumber.from(10000000000000))
        ).to.be.revertedWith('not enough token')
      })
    })

    it('gets', async () => {
      const { contract } = await loadFixture(fixture)
      await contract.initializeVotingRoom('T1', 'short desc', BigNumber.from(100))

      expect((await contract.votingRooms(0))[2]).to.eq('T1')
      expect((await contract.votingRooms(0))[3]).to.eq('short desc')
      expect((await contract.votingRooms(0))[4]).to.deep.eq(BigNumber.from(100))
      expect((await contract.votingRooms(0))[5]).to.deep.eq(BigNumber.from(0))

      await contract.initializeVotingRoom('T2', 'long desc', BigNumber.from(200))
      expect((await contract.votingRooms(1))[2]).to.eq('T2')
      expect((await contract.votingRooms(1))[3]).to.eq('long desc')
      expect((await contract.votingRooms(1))[4]).to.deep.eq(BigNumber.from(200))
      expect((await contract.votingRooms(1))[5]).to.deep.eq(BigNumber.from(0))
    })

    it('reverts no room', async () => {
      const { contract } = await loadFixture(fixture)
      await expect(contract.votingRooms(1)).to.be.reverted
      await expect(contract.votingRooms(0)).to.be.reverted
      await contract.initializeVotingRoom('T2', '', BigNumber.from(200))
      await expect(contract.votingRooms(1)).to.be.reverted
    })
  })
  describe('helpers', () => {
    it('get voting rooms', async () => {
      const { contract, firstAddress, secondAddress, provider } = await loadFixture(fixture)
      await contract.initializeVotingRoom('T1', 't1', BigNumber.from(100))

      await contract.initializeVotingRoom('T2', 't2', BigNumber.from(200))
      const votingRooms = await contract.getVotingRooms()

      expect(votingRooms.length).to.eq(2)

      expect(votingRooms[0][2]).to.eq('T1')
      expect(votingRooms[0][3]).to.eq('t1')
      expect(votingRooms[0][4]).to.deep.eq(BigNumber.from(100))
      expect(votingRooms[0][5]).to.deep.eq(BigNumber.from(0))

      expect(votingRooms[1][2]).to.eq('T2')
      expect(votingRooms[1][3]).to.eq('t2')
      expect(votingRooms[1][4]).to.deep.eq(BigNumber.from(200))
      expect(votingRooms[1][5]).to.deep.eq(BigNumber.from(0))
    })
  })

  describe('voting', () => {
    it('check voters', async () => {
      const { contract, alice, firstAddress, secondAddress } = await loadFixture(fixture)
      const { signedMessages } = await getSignedMessages(alice, firstAddress, secondAddress)
      await contract.initializeVotingRoom('0xabA1eF51ef4aE360a9e8C9aD2d787330B602eb24', '', BigNumber.from(100))

      expect(await contract.listRoomVoters(0)).to.deep.eq([alice.address])
      await contract.castVotes(signedMessages.slice(2))

      expect(await contract.listRoomVoters(0)).to.deep.eq([alice.address, secondAddress.address])
    })

    it('not enough tokens', async () => {
      const { contract, firstAddress } = await loadFixture(fixture)
      await contract.initializeVotingRoom('test', '', BigNumber.from(100))

      const msg = [firstAddress.address, BigNumber.from(0).mul(2).add(1), BigNumber.from(100000000000)]
      const t: TypedMessage<MessageTypes> = {
        ...typedData,
        message: { roomIdAndType: msg[1].toHexString(), tokenAmount: msg[2].toHexString(), voter: msg[0] },
      }
      const sig = utils.splitSignature(
        signTypedMessage(Buffer.from(utils.arrayify(firstAddress.privateKey)), { data: t }, 'V3')
      )
      const signedMessage = [...msg, sig.r, sig._vs]

      await expect(await contract.castVotes([signedMessage]))
        .to.emit(contract, 'NotEnoughToken')
        .withArgs(0, firstAddress.address)

      const votingRoom = await contract.votingRooms(0)
      expect(votingRoom[2]).to.eq('test')
      expect(votingRoom[3]).to.eq('')
      expect(votingRoom[4]).to.deep.eq(BigNumber.from(100))
      expect(votingRoom[5]).to.deep.eq(BigNumber.from(0))
    })

    it('success', async () => {
      const { contract, alice, firstAddress, secondAddress } = await loadFixture(fixture)
      const { signedMessages } = await getSignedMessages(alice, firstAddress, secondAddress)
      await contract.initializeVotingRoom('test', 'test desc', BigNumber.from(100))
      await contract.castVotes(signedMessages)

      const votingRoom = await contract.votingRooms(0)
      expect(votingRoom[2]).to.eq('test')
      expect(votingRoom[3]).to.eq('test desc')
      expect(votingRoom[4]).to.deep.eq(BigNumber.from(200))
      expect(votingRoom[5]).to.deep.eq(BigNumber.from(100))
    })

    it('double vote', async () => {
      const { contract, alice, firstAddress, secondAddress } = await loadFixture(fixture)
      const { signedMessages } = await getSignedMessages(alice, firstAddress, secondAddress)
      await contract.initializeVotingRoom('test', '', BigNumber.from(100))
      await contract.castVotes(signedMessages)
      await contract.castVotes(signedMessages)

      const votingRoom = await contract.votingRooms(0)
      expect(votingRoom[2]).to.eq('test')
      expect(votingRoom[3]).to.eq('')
      expect(votingRoom[4]).to.deep.eq(BigNumber.from(200))
      expect(votingRoom[5]).to.deep.eq(BigNumber.from(100))
    })

    it('random bytes', async () => {
      const { contract } = await loadFixture(fixture)
      await contract.initializeVotingRoom('test', '', BigNumber.from(100))
      await expect(contract.castVotes([new Uint8Array([12, 12, 12])])).to.be.reverted
    })

    it('none existent room', async () => {
      const { contract, alice, firstAddress, secondAddress } = await loadFixture(fixture)
      const { signedMessages } = await getSignedMessages(alice, firstAddress, secondAddress)
      await expect(contract.castVotes(signedMessages)).to.be.reverted
    })

    it('old room', async () => {
      const { contract, alice, firstAddress, secondAddress, provider } = await loadFixture(fixture)
      const { signedMessages } = await getSignedMessages(alice, firstAddress, secondAddress)
      await contract.initializeVotingRoom('test', '', BigNumber.from(100))
      await provider.send('evm_mine', [Math.floor(Date.now() / 1000 + 2000)])
      await expect(contract.castVotes(signedMessages)).to.be.reverted
    })

    it('wrong signature', async () => {
      const { contract, alice, firstAddress, secondAddress, provider } = await loadFixture(fixture)
      const { messages } = await getSignedMessages(alice, firstAddress, secondAddress)

      await contract.initializeVotingRoom('test', '', BigNumber.from(100))
      await provider.send('evm_mine', [Math.floor(Date.now() / 1000 + 2000)])

      const signedMessages = await Promise.all(
        messages.map(async (msg) => {
          const t: TypedMessage<MessageTypes> = {
            ...typedData,
            message: { roomIdAndType: msg[1].toHexString(), tokenAmount: msg[2].toHexString(), voter: msg[0] },
          }
          const sig = utils.splitSignature(
            signTypedMessage(Buffer.from(utils.arrayify(firstAddress.privateKey)), { data: t }, 'V3')
          )
          const signedMessage = [...msg, sig.r, sig._vs]
          return signedMessage
        })
      )

      await expect(contract.castVotes(signedMessages)).to.be.reverted
    })
  })
})
