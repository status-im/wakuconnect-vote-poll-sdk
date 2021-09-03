import { expect } from 'chai'
import { TimedPollVoteMsg } from '../../src/models/TimedPollVoteMsg'
import { MockProvider } from 'ethereum-waffle'
import { BigNumber } from 'ethers'

describe('TimedPollVoteMsg', () => {
  const provider = new MockProvider()
  const [alice] = provider.getWallets()
  const pollId = '0x14c336ef626274f156d094fc1d7ffad2bbc83cccc9817598dd55e42a86b56b72'

  describe('create', () => {
    it('success', async () => {
      const vote = await TimedPollVoteMsg._createWithSignFunction(async () => '0x01', alice, pollId, 0, 0)

      if (vote) {
        expect(vote.voter).to.eq(alice.address)
        expect(vote.answer).to.eq(0)
        expect(vote.pollId).to.be.eq(pollId)
        expect(vote.tokenAmount).to.be.undefined
        expect(vote.signature).to.eq('0x01')
      }
    })

    it('success token amount', async () => {
      const vote = await TimedPollVoteMsg._createWithSignFunction(
        async () => '0x01',
        alice,
        pollId,
        1,
        0,
        BigNumber.from(100)
      )

      expect(vote).to.not.be.undefined
      if (vote) {
        expect(vote.voter).to.eq(alice.address)
        expect(vote.answer).to.eq(1)
        expect(vote.pollId).to.be.eq(pollId)
        expect(vote.tokenAmount).to.deep.eq(BigNumber.from(100))
        expect(vote.signature).to.eq('0x01')
      }
    })
  })

  describe('decode/encode', () => {
    it('success', async () => {
      const data = await TimedPollVoteMsg._createWithSignFunction(async () => '0x01', alice, pollId, 0, 0)

      expect(data).to.not.be.undefined
      if (data) {
        const payload = await data.encode()

        expect(payload).to.not.be.undefined
        if (payload) {
          expect(await TimedPollVoteMsg.decode(payload, new Date(data.timestamp), 0, () => true)).to.deep.eq(data)
        }
      }
    })

    it('random decode', async () => {
      expect(TimedPollVoteMsg.decode(new Uint8Array([12, 12, 3, 32, 31, 212, 31, 32, 23]), new Date(10), 0)).to.be
        .undefined
    })

    it('data with token', async () => {
      const data = await TimedPollVoteMsg._createWithSignFunction(
        async () => '0x01',
        alice,
        pollId,
        0,
        0,
        BigNumber.from(120)
      )
      expect(data).to.not.be.undefined
      if (data) {
        const payload = data.encode()

        expect(payload).to.not.be.undefined
        if (payload) {
          expect(TimedPollVoteMsg.decode(payload, new Date(data.timestamp), 0, () => true)).to.deep.eq({
            ...data,
            tokenAmount: BigNumber.from(120),
          })
        }
      }
    })
  })
})
