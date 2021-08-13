import { expect } from 'chai'
import { createSignMsgParams, PollInitMsg } from '../../src/models/PollInitMsg'
import { MockProvider } from 'ethereum-waffle'
import { PollType } from '../../src/types/PollType'
import { BigNumber } from 'ethers'

describe('PollInitMsg', () => {
  const provider = new MockProvider()
  const [alice] = provider.getWallets()

  it('success', async () => {
    const poll = await PollInitMsg._createWithSignFunction(
      async (params) => params.join(),
      alice,
      'test',
      ['one', 'two', 'three'],
      PollType.WEIGHTED
    )

    expect(poll).to.not.be.undefined
    if (poll) {
      expect(poll.owner).to.eq(alice.address)
      expect(poll.endTime).to.eq(poll.timestamp + 100000000)
      expect(poll.answers).to.deep.eq(['one', 'two', 'three'])
      expect(poll.minToken).to.be.undefined
      expect(poll.pollType).to.eq(PollType.WEIGHTED)
      expect(poll.question).to.eq('test')

      expect(poll.signature).to.eq(
        [
          poll.owner,
          JSON.stringify(
            createSignMsgParams({
              owner: poll.owner,
              timestamp: poll.timestamp,
              question: poll.question,
              answers: poll.answers,
              pollType: poll.pollType,
              endTime: poll.endTime,
              minToken: poll.minToken,
            })
          ),
        ].join()
      )
    }
  })

  it('success NON_WEIGHTED', async () => {
    const poll = await PollInitMsg._createWithSignFunction(
      async (params) => params.join(),
      alice,
      'test',
      ['one', 'two', 'three'],
      PollType.NON_WEIGHTED,
      BigNumber.from(123)
    )
    expect(poll).to.not.be.undefined
    expect(poll?.minToken?.toNumber()).to.eq(123)
    if (poll) {
      expect(poll.signature).to.eq(
        [
          poll.owner,
          JSON.stringify(
            createSignMsgParams({
              owner: poll.owner,
              timestamp: poll.timestamp,
              question: poll.question,
              answers: poll.answers,
              pollType: poll.pollType,
              endTime: poll.endTime,
              minToken: poll.minToken,
            })
          ),
        ].join()
      )
    }
  })

  it('NON_WEIGHTED no minToken', async () => {
    const poll = await PollInitMsg._createWithSignFunction(
      async (params) => params.join(),
      alice,
      'test',
      ['one', 'two', 'three'],
      PollType.NON_WEIGHTED
    )

    expect(poll?.minToken?.toNumber()).to.eq(1)
    expect(poll).to.not.be.undefined
    if (poll) {
      const msg = createSignMsgParams({
        owner: poll.owner,
        timestamp: poll.timestamp,
        question: poll.question,
        answers: poll.answers,
        pollType: poll.pollType,
        endTime: poll.endTime,
        minToken: poll.minToken,
      })

      expect(poll.signature).to.eq([poll.owner, JSON.stringify(msg)].join())
    }
  })

  it('specific end time', async () => {
    const poll = await PollInitMsg._createWithSignFunction(
      async () => 'a',
      alice,
      'test',
      ['one', 'two', 'three'],
      PollType.NON_WEIGHTED,
      undefined,
      100
    )

    expect(poll?.endTime).to.eq(100)
  })
})
