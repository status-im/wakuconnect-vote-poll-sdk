import { expect, use } from 'chai'
import { loadFixture, deployContract, MockProvider, solidity } from 'ethereum-waffle'
import { VotingContract, ERC20Mock } from '../abi'
import { utils, Wallet, Contract } from 'ethers'
import { signTypedMessage, TypedMessage } from 'eth-sig-util'
import { BigNumber } from '@ethersproject/bignumber'
import { JsonRpcProvider } from '@ethersproject/providers'

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

async function fixture([alice, firstAddress, secondAddress, noTokensAddress]: any[], provider: JsonRpcProvider) {
  const erc20 = await deployContract(alice, ERC20Mock, ['MSNT', 'Mock SNT', alice.address, 100000])
  await erc20.transfer(firstAddress.address, 10000)
  await erc20.transfer(secondAddress.address, 10000)
  const contract = await deployContract(alice, VotingContract, [erc20.address, 1000])
  const secondContract = await deployContract(alice, VotingContract, [erc20.address, 1000])
  return { contract, secondContract, alice, firstAddress, secondAddress, provider, noTokensAddress }
}

before(async function () {
  this.timeout(20000)
  const { contract } = await loadFixture(fixture)
  typedData.domain.chainId = 1
  typedData.domain.verifyingContract = contract.address
})

describe('Contract', () => {
  describe('Proposal', () => {
    describe('initialization', () => {
      it('initializes', async () => {
        const { contract } = await loadFixture(fixture)

        await expect(await contract.initializeProposal('test', 'short desc', BigNumber.from(100)))
          .to.emit(contract, 'ProposalStarted')
          .withArgs(0, 'test')
        await expect(await contract.initializeProposal('test2', 'short desc', BigNumber.from(100)))
          .to.emit(contract, 'ProposalStarted')
          .withArgs(1, 'test2')
      })

      it('sender does not have the amount of token they voted for', async () => {
        const { contract } = await loadFixture(fixture)
        await expect(
          contract.initializeProposal('test', 'short desc', BigNumber.from(10000000000000))
        ).to.be.revertedWith('sender does not have the amount of token they voted for')
      })

      it('no tokens address', async () => {
        const { contract, noTokensAddress } = await loadFixture(fixture)
        const noTokensContract = contract.connect(noTokensAddress)
        await expect(
          noTokensContract.initializeProposal('test', 'short desc', BigNumber.from(10))
        ).to.be.revertedWith('sender does not have the amount of token they voted for')
      })

      it("can't start voting with 0 tokens", async () => {
        const { contract, noTokensAddress } = await loadFixture(fixture)
        const noTokensContract = contract.connect(noTokensAddress)
        await expect(noTokensContract.initializeProposal('test', 'short desc', BigNumber.from(0))).to.be.revertedWith(
          'token amount must not be 0'
        )
      })
    })

    it('gets', async () => {
      const { contract } = await loadFixture(fixture)
      await contract.initializeProposal('T1', 'short desc', BigNumber.from(100))
      const proposals = await contract.proposals(0)
      expect(proposals[2]).to.eq('T1')
      expect(proposals[3]).to.eq('short desc')
      expect(proposals[4]).to.deep.eq(BigNumber.from(100))
      expect(proposals[5]).to.deep.eq(BigNumber.from(0))
      expect(proposals[6]).to.deep.eq(BigNumber.from(0))

      await contract.initializeProposal('T2', 'long desc', BigNumber.from(200))
      expect((await contract.proposals(1))[2]).to.eq('T2')
      expect((await contract.proposals(1))[3]).to.eq('long desc')
      expect((await contract.proposals(1))[4]).to.deep.eq(BigNumber.from(200))
      expect((await contract.proposals(1))[5]).to.deep.eq(BigNumber.from(0))
      expect((await contract.proposals(1))[6]).to.deep.eq(BigNumber.from(1))
    })

    it('reverts no room', async () => {
      const { contract } = await loadFixture(fixture)
      await expect(contract.proposals(1)).to.be.reverted
      await expect(contract.proposals(0)).to.be.reverted
      await contract.initializeProposal('T2', '', BigNumber.from(200))
      await expect(contract.proposals(1)).to.be.reverted
    })

    it('getOngoingVotingRooms', async () => {
      const { contract, provider } = await loadFixture(fixture)

      await expect((await contract.getOpenProposals()).length).to.eq(0)
      await contract.initializeProposal('test1', 'short desc', BigNumber.from(100))

      let rooms
      rooms = await contract.getOpenProposals()
      await expect(rooms.length).to.eq(1)
      await expect(rooms[0][2]).to.eq('test1')
      await provider.send('evm_increaseTime', [500])
      await provider.send('evm_mine', [])

      await contract.initializeProposal('test2', 'short desc', BigNumber.from(100))
      rooms = await contract.getOpenProposals()
      await expect(rooms.length).to.eq(2)
      await expect(rooms[0][2]).to.eq('test2')
      await expect(rooms[1][2]).to.eq('test1')
      await provider.send('evm_increaseTime', [600])
      await provider.send('evm_mine', [])

      rooms = await contract.getOpenProposals()

      await expect(rooms.length).to.eq(1)
      await expect(rooms[0][2]).to.eq('test2')
      await provider.send('evm_increaseTime', [600])
      await provider.send('evm_mine', [])
      rooms = await contract.getOpenProposals()
      await expect(rooms.length).to.eq(0)
    })
  })
  describe('helpers', () => {
    describe('getLastNProposals', () => {
      it('get 0 voting empty', async () => {
        const { contract } = await loadFixture(fixture)
        expect((await contract.getLastNProposals(0)).length).to.eq(0)
      })

      it('get 1 voting empty', async () => {
        const { contract } = await loadFixture(fixture)
        expect((await contract.getLastNProposals(1)).length).to.eq(0)
      })

      it('get 1 voting 1', async () => {
        const { contract } = await loadFixture(fixture)
        await contract.initializeProposal('T1', 't1', BigNumber.from(100))
        expect((await contract.getLastNProposals(1)).length).to.eq(1)
      })

      it('get 5 voting empty', async () => {
        const { contract } = await loadFixture(fixture)
        expect((await contract.getLastNProposals(5)).length).to.eq(0)
      })

      it('get 5 voting 1', async () => {
        const { contract } = await loadFixture(fixture)
        await contract.initializeProposal('T1', 't1', BigNumber.from(100))
        expect((await contract.getLastNProposals(5)).length).to.eq(1)
      })

      it('get 5 voting 2', async () => {
        const { contract } = await loadFixture(fixture)
        await contract.initializeProposal('T1', 't1', BigNumber.from(100))
        await contract.initializeProposal('T2', 't2', BigNumber.from(200))
        expect((await contract.getLastNProposals(5)).length).to.eq(2)
      })

      it('get 5 voting 4', async () => {
        const { contract } = await loadFixture(fixture)
        await contract.initializeProposal('T1', 't1', BigNumber.from(100))
        await contract.initializeProposal('T2', 't2', BigNumber.from(200))
        await contract.initializeProposal('T3', 't3', BigNumber.from(200))
        await contract.initializeProposal('T4', 't4', BigNumber.from(200))
        expect((await contract.getLastNProposals(5)).length).to.eq(4)
      })

      it('get 5 voting 5', async () => {
        const { contract } = await loadFixture(fixture)
        await contract.initializeProposal('T1', 't1', BigNumber.from(100))
        await contract.initializeProposal('T2', 't2', BigNumber.from(200))
        await contract.initializeProposal('T3', 't3', BigNumber.from(200))
        await contract.initializeProposal('T4', 't4', BigNumber.from(200))
        await contract.initializeProposal('T5', 't5', BigNumber.from(200))
        expect((await contract.getLastNProposals(5)).length).to.eq(5)
      })

      it('get 5 voting 6', async () => {
        const { contract } = await loadFixture(fixture)
        await contract.initializeProposal('T1', 't1', BigNumber.from(100))
        await contract.initializeProposal('T2', 't2', BigNumber.from(200))
        await contract.initializeProposal('T3', 't3', BigNumber.from(200))
        await contract.initializeProposal('T4', 't4', BigNumber.from(200))
        await contract.initializeProposal('T5', 't5', BigNumber.from(200))
        await contract.initializeProposal('T6', 't6', BigNumber.from(200))
        await contract.initializeProposal('T7', 't7', BigNumber.from(200))
        expect((await contract.getLastNProposals(5)).length).to.eq(5)
      })

      it('get 5 voting 7', async () => {
        const { contract } = await loadFixture(fixture)
        await contract.initializeProposal('T1', 't1', BigNumber.from(100))
        await contract.initializeProposal('T2', 't2', BigNumber.from(200))
        await contract.initializeProposal('T3', 't3', BigNumber.from(200))
        await contract.initializeProposal('T4', 't4', BigNumber.from(200))
        await contract.initializeProposal('T5', 't5', BigNumber.from(200))
        await contract.initializeProposal('T6', 't6', BigNumber.from(200))
        await contract.initializeProposal('T7', 't7', BigNumber.from(200))
        expect((await contract.getLastNProposals(5)).length).to.eq(5)
      })
    })

    describe('getVotingRoomsFrom', () => {
      it('empty', async () => {
        const { contract } = await loadFixture(fixture)
        expect((await contract.getProposalFromId(1)).length).to.eq(0)
      })
      it('from 1 votingRooms 1', async () => {
        const { contract } = await loadFixture(fixture)
        await contract.initializeProposal('T1', 't1', BigNumber.from(100))
        expect((await contract.getProposalFromId(1)).length).to.eq(0)
      })

      it('from 1 votingRooms 2', async () => {
        const { contract } = await loadFixture(fixture)
        await contract.initializeProposal('T1', 't1', BigNumber.from(100))
        await contract.initializeProposal('T2', 't2', BigNumber.from(200))
        expect((await contract.getProposalFromId(1)).length).to.eq(1)
      })

      it('from 1 votingRooms 3', async () => {
        const { contract } = await loadFixture(fixture)
        await contract.initializeProposal('T1', 't1', BigNumber.from(100))
        await contract.initializeProposal('T2', 't2', BigNumber.from(200))
        await contract.initializeProposal('T3', 't3', BigNumber.from(200))
        expect((await contract.getProposalFromId(1)).length).to.eq(2)
      })

      it('from 0 votingRooms 0', async () => {
        const { contract } = await loadFixture(fixture)
        expect((await contract.getProposalFromId(0)).length).to.eq(0)
      })

      it('from 0 votingRooms 1', async () => {
        const { contract } = await loadFixture(fixture)
        await contract.initializeProposal('T1', 't1', BigNumber.from(100))
        expect((await contract.getProposalFromId(0)).length).to.eq(1)
      })

      it('from 0 votingRooms 2', async () => {
        const { contract } = await loadFixture(fixture)
        await contract.initializeProposal('T1', 't1', BigNumber.from(100))
        await contract.initializeProposal('T2', 't2', BigNumber.from(100))
        expect((await contract.getProposalFromId(0)).length).to.eq(2)
      })
    })

    it('get proposals', async () => {
      const { contract } = await loadFixture(fixture)
      await contract.initializeProposal('T1', 't1', BigNumber.from(100))

      await contract.initializeProposal('T2', 't2', BigNumber.from(200))
      const proposals = await contract.getProposals()

      expect(proposals.length).to.eq(2)

      expect(proposals[0][2]).to.eq('T1')
      expect(proposals[0][3]).to.eq('t1')
      expect(proposals[0][4]).to.deep.eq(BigNumber.from(100))
      expect(proposals[0][5]).to.deep.eq(BigNumber.from(0))

      expect(proposals[1][2]).to.eq('T2')
      expect(proposals[1][3]).to.eq('t2')
      expect(proposals[1][4]).to.deep.eq(BigNumber.from(200))
      expect(proposals[1][5]).to.deep.eq(BigNumber.from(0))
    })
  })

  describe('voting', () => {
    it('check voters', async () => {
      const { contract, alice, firstAddress, secondAddress } = await loadFixture(fixture)
      const { signedMessages } = await getSignedMessages(alice, firstAddress, secondAddress)
      await contract.initializeProposal('0xabA1eF51ef4aE360a9e8C9aD2d787330B602eb24', '', BigNumber.from(100))

      expect(await contract.listVotersForProposal(0)).to.deep.eq([alice.address])
      await contract.castVotes(signedMessages.slice(1))

      expect(await contract.listVotersForProposal(0)).to.deep.eq([alice.address, secondAddress.address])
    })

    it('voter doesnt have enough tokens', async () => {
      const { contract, firstAddress } = await loadFixture(fixture)
      await contract.initializeProposal('test', '', BigNumber.from(100))

      const msg = [firstAddress.address, BigNumber.from(0).mul(2).add(1), BigNumber.from(100000000000)]
      const t: TypedMessage<MessageTypes> = {
        ...typedData,
        message: { roomIdAndType: msg[1].toHexString(), tokenAmount: msg[2].toHexString(), voter: msg[0] },
      }
      const sig = utils.splitSignature(
        signTypedMessage(Buffer.from(utils.arrayify(firstAddress.privateKey)), { data: t }, 'V3')
      )
      const signedMessage = [...msg, sig.r, sig._vs]

      await expect(contract.castVotes([signedMessage])).to.be.revertedWith('voter doesnt have enough tokens')

      const votingRoom = await contract.proposals(0)
      expect(votingRoom[2]).to.eq('test')
      expect(votingRoom[3]).to.eq('')
      expect(votingRoom[4]).to.deep.eq(BigNumber.from(100))
      expect(votingRoom[5]).to.deep.eq(BigNumber.from(0))
    })

    it('success', async () => {
      const { contract, alice, firstAddress, secondAddress } = await loadFixture(fixture)
      const { signedMessages } = await getSignedMessages(alice, firstAddress, secondAddress)
      await contract.initializeProposal('test', 'test desc', BigNumber.from(100))
      await contract.castVotes(signedMessages)

      const votingRoom = await contract.proposals(0)
      expect(votingRoom[2]).to.eq('test')
      expect(votingRoom[3]).to.eq('test desc')
      expect(votingRoom[4]).to.deep.eq(BigNumber.from(200))
      expect(votingRoom[5]).to.deep.eq(BigNumber.from(100))
    })

    it('double vote', async () => {
      const { contract, alice, firstAddress, secondAddress } = await loadFixture(fixture)
      const { signedMessages } = await getSignedMessages(alice, firstAddress, secondAddress)
      await contract.initializeProposal('test', '', BigNumber.from(100))
      await contract.castVotes(signedMessages)
      await expect(contract.castVotes(signedMessages)).to.be.revertedWith('voter already voted')

      const votingRoom = await contract.proposals(0)
      expect(votingRoom[2]).to.eq('test')
      expect(votingRoom[3]).to.eq('')
      expect(votingRoom[4]).to.deep.eq(BigNumber.from(200))
      expect(votingRoom[5]).to.deep.eq(BigNumber.from(100))
    })

    it('random bytes', async () => {
      const { contract } = await loadFixture(fixture)
      await contract.initializeProposal('test', '', BigNumber.from(100))
      await expect(contract.castVotes([new Uint8Array([12, 12, 12])])).to.be.reverted
    })

    it('none existent proposal', async () => {
      const { contract, alice, firstAddress, secondAddress } = await loadFixture(fixture)
      const { signedMessages } = await getSignedMessages(alice, firstAddress, secondAddress)
      await expect(contract.castVotes(signedMessages)).to.be.revertedWith('proposal does not exist')
    })

    it('proposal closed', async () => {
      const { contract, alice, firstAddress, secondAddress, provider } = await loadFixture(fixture)
      const { signedMessages } = await getSignedMessages(alice, firstAddress, secondAddress)
      await contract.initializeProposal('test', '', BigNumber.from(100))
      await provider.send('evm_increaseTime', [10000])
      await expect(contract.castVotes(signedMessages)).to.be.revertedWith('vote closed for this proposal')
    })

    it('wrong signature', async () => {
      const { contract, alice, firstAddress, secondAddress } = await loadFixture(fixture)
      const { messages } = await getSignedMessages(alice, firstAddress, secondAddress)

      await contract.initializeProposal('test', '', BigNumber.from(100))

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

      await expect(contract.castVotes(signedMessages)).to.be.revertedWith('vote has wrong signature')
    })

    it("vote can't be reused", async () => {
      const createMessage = (voter: any, domainSeparator: any) => {
        const correctMessageParams = [voter.address, BigNumber.from(0).mul(2).add(0), BigNumber.from(10)]
        const correctMessageData: TypedMessage<MessageTypes> = {
          ...domainSeparator,
          message: {
            roomIdAndType: correctMessageParams[1].toHexString(),
            tokenAmount: correctMessageParams[2].toHexString(),
            voter: correctMessageParams[0],
          },
        }

        const correctSig = utils.splitSignature(
          signTypedMessage(Buffer.from(utils.arrayify(voter.privateKey)), { data: correctMessageData }, 'V3')
        )

        return [...correctMessageParams, correctSig.r, correctSig._vs]
      }

      const { contract, secondContract, firstAddress } = await loadFixture(fixture)

      await contract.initializeProposal('test', '', BigNumber.from(100))
      await secondContract.initializeProposal('test', '', BigNumber.from(100))

      const correctAddress = createMessage(firstAddress, typedData)
      await expect(contract.castVotes([correctAddress])).not.to.be.reverted
      await expect(secondContract.castVotes([correctAddress])).to.be.revertedWith('vote has wrong signature')
    })
  })
})
