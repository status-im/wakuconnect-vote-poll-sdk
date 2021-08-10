import { expect } from 'chai'
import TimedPollVote from '../../../src/utils/proto/TimedPollVote'
import { BigNumber } from 'ethers'
import { TimedPollVoteMsg } from '../../../src/models/TimedPollVoteMsg'
import { MockProvider } from 'ethereum-waffle'

describe('TimedPollVote', () => {
  const provider = new MockProvider()
  const [alice] = provider.getWallets()
  const pollId = '0x14c336ef626274f156d094fc1d7ffad2bbc83cccc9817598dd55e42a86b56b72'

  it('success', async () => {
    const data = await TimedPollVoteMsg.create(alice, pollId, 0)
    const payload = TimedPollVote.encode(data)

    expect(payload).to.not.be.undefined
    if (payload) {
      expect(TimedPollVote.decode(payload, new Date(data.timestamp))).to.deep.eq(data)
    }
  })

  it('random decode', async () => {
    expect(TimedPollVote.decode(new Uint8Array([12, 12, 3, 32, 31, 212, 31, 32, 23]), new Date(10))).to.be.undefined
  })

  it('random data', async () => {
    expect(TimedPollVote.encode({ sadf: '0x0' } as unknown as TimedPollVoteMsg)).to.be.undefined
  })

  it('data with token', async () => {
    const data = await TimedPollVoteMsg.create(alice, pollId, 0, BigNumber.from(120))

    const payload = TimedPollVote.encode(data)

    expect(payload).to.not.be.undefined
    if (payload) {
      expect(TimedPollVote.decode(payload, new Date(data.timestamp))).to.deep.eq({
        ...data,
        tokenAmount: BigNumber.from(120),
      })
    }
  })
})
