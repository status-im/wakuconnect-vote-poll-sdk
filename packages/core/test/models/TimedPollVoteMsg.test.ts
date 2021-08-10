import { expect } from 'chai'
import { TimedPollVoteMsg } from '../../src/models/TimedPollVoteMsg'
import { MockProvider } from 'ethereum-waffle'
import { BigNumber, utils } from 'ethers'

describe('TimedPollVoteMsg', () => {
  const provider = new MockProvider()
  const [alice] = provider.getWallets()
  const pollId = '0x14c336ef626274f156d094fc1d7ffad2bbc83cccc9817598dd55e42a86b56b72'
  it('success', async () => {
    const poll = await TimedPollVoteMsg.create(alice, pollId, 0)

    expect(poll).to.not.be.undefined
    expect(poll.voter).to.eq(alice.address)
    expect(poll.answer).to.eq(0)
    expect(poll.id).to.be.eq(pollId)
    expect(poll.tokenAmount).to.be.undefined

    const msg: (string | number | BigNumber)[] = [poll.id, poll.voter, poll.timestamp, poll.answer]
    const types = ['bytes32', 'address', 'uint256', 'uint64']
    const packedData = utils.arrayify(utils.solidityPack(types, msg))

    const verifiedAddress = utils.verifyMessage(packedData, poll.signature)
    expect(verifiedAddress).to.eq(alice.address)
  })

  it('success token amount', async () => {
    const poll = await TimedPollVoteMsg.create(alice, pollId, 1, BigNumber.from(100))

    expect(poll).to.not.be.undefined
    expect(poll.voter).to.eq(alice.address)
    expect(poll.answer).to.eq(1)
    expect(poll.id).to.be.eq(pollId)
    expect(poll.tokenAmount).to.deep.eq(BigNumber.from(100))

    const msg: (string | number | BigNumber | undefined)[] = [
      poll.id,
      poll.voter,
      poll.timestamp,
      poll.answer,
      poll?.tokenAmount,
    ]
    const types = ['bytes32', 'address', 'uint256', 'uint64', 'uint256']
    const packedData = utils.arrayify(utils.solidityPack(types, msg))

    const verifiedAddress = utils.verifyMessage(packedData, poll.signature)
    expect(verifiedAddress).to.eq(alice.address)
  })
})
