import { expect } from 'chai'
import { TimedPollVoteMsg } from '../../src/models/TimedPollVoteMsg'
import { MockProvider } from 'ethereum-waffle'
import { BigNumber } from 'ethers'

describe('TimedPollVoteMsg', () => {
  const provider = new MockProvider()
  const [alice] = provider.getWallets()
  const pollId = '0x14c336ef626274f156d094fc1d7ffad2bbc83cccc9817598dd55e42a86b56b72'
  it('success', async () => {
    const poll = await TimedPollVoteMsg._createWithSignFunction(
      async (e) => new TimedPollVoteMsg('0x01', e),
      alice,
      pollId,
      0
    )

    expect(poll).to.not.be.undefined
    if (poll) {
      expect(poll.voter).to.eq(alice.address)
      expect(poll.answer).to.eq(0)
      expect(poll.id).to.be.eq(pollId)
      expect(poll.tokenAmount).to.be.undefined
      expect(poll.signature).to.eq('0x01')
    }
  })

  it('success token amount', async () => {
    const poll = await TimedPollVoteMsg._createWithSignFunction(
      async (e) => new TimedPollVoteMsg('0x01', e),
      alice,
      pollId,
      1,
      BigNumber.from(100)
    )

    expect(poll).to.not.be.undefined
    if (poll) {
      expect(poll.voter).to.eq(alice.address)
      expect(poll.answer).to.eq(1)
      expect(poll.id).to.be.eq(pollId)
      expect(poll.tokenAmount).to.deep.eq(BigNumber.from(100))
      expect(poll.signature).to.eq('0x01')
    }
  })
})
