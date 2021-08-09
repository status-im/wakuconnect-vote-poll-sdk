import { expect } from 'chai'
import { PollInitMsg } from '../../src/models/PollInitMsg'
import { MockProvider } from 'ethereum-waffle'
import { PollType } from '../../src/types/PollType'
import { JsonRpcSigner } from '@ethersproject/providers'
import { BigNumber, utils } from 'ethers'

describe('PollInitMsg', () => {
  const provider = new MockProvider()
  const [alice] = provider.getWallets()

  it('success', async () => {
    const poll = await PollInitMsg.create(
      alice as unknown as JsonRpcSigner,
      'test',
      ['one', 'two', 'three'],
      PollType.WEIGHTED
    )

    expect(poll).to.not.be.undefined
    expect(poll.owner).to.eq(alice.address)
    expect(poll.endTime).to.eq(poll.timestamp + 10000000)
    expect(poll.answers).to.deep.eq(['one', 'two', 'three'])
    expect(poll.minToken).to.be.undefined
    expect(poll.pollType).to.eq(PollType.WEIGHTED)
    expect(poll.question).to.eq('test')

    const types = ['address', 'uint256', 'string', 'string', 'uint8', 'uint256']
    const msg = [poll.owner, poll.timestamp, poll.question, poll.answers.join(), poll.pollType, poll.endTime]
    const packedData = utils.arrayify(utils.solidityPack(types, msg))

    const verifiedAddress = utils.verifyMessage(packedData, poll.signature)
    expect(verifiedAddress).to.eq(alice.address)
  })

  it('success NON_WEIGHTED', async () => {
    const poll = await PollInitMsg.create(
      alice as unknown as JsonRpcSigner,
      'test',
      ['one', 'two', 'three'],
      PollType.NON_WEIGHTED,
      BigNumber.from(123)
    )

    expect(poll?.minToken?.toNumber()).to.eq(123)

    const types = ['address', 'uint256', 'string', 'string', 'uint8', 'uint256', 'uint256']
    const msg = [
      poll.owner,
      poll.timestamp,
      poll.question,
      poll.answers.join(),
      poll.pollType,
      poll.endTime,
      poll.minToken,
    ]
    const packedData = utils.arrayify(utils.solidityPack(types, msg))

    const verifiedAddress = utils.verifyMessage(packedData, poll.signature)
    expect(verifiedAddress).to.eq(alice.address)
  })

  it('NON_WEIGHTED no minToken', async () => {
    const poll = await PollInitMsg.create(
      alice as unknown as JsonRpcSigner,
      'test',
      ['one', 'two', 'three'],
      PollType.NON_WEIGHTED
    )

    expect(poll?.minToken?.toNumber()).to.eq(1)

    const types = ['address', 'uint256', 'string', 'string', 'uint8', 'uint256', 'uint256']
    const msg = [
      poll.owner,
      poll.timestamp,
      poll.question,
      poll.answers.join(),
      poll.pollType,
      poll.endTime,
      poll.minToken,
    ]
    const packedData = utils.arrayify(utils.solidityPack(types, msg))

    const verifiedAddress = utils.verifyMessage(packedData, poll.signature)
    expect(verifiedAddress).to.eq(alice.address)
  })

  it('specific end time', async () => {
    const poll = await PollInitMsg.create(
      alice as unknown as JsonRpcSigner,
      'test',
      ['one', 'two', 'three'],
      PollType.NON_WEIGHTED,
      undefined,
      100
    )

    expect(poll?.endTime).to.eq(100)
  })
})
