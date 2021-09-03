import { expect } from 'chai'
import { PollInitMsg } from '../../src/models/PollInitMsg'
import { MockProvider } from 'ethereum-waffle'
import { PollType } from '../../src/types/PollType'
import { BigNumber } from 'ethers'

describe('PollInitMsg', () => {
  const provider = new MockProvider()
  const [alice] = provider.getWallets()
  describe('create', () => {
    it('success', async () => {
      const poll = await PollInitMsg._createWithSignFunction(
        async () => '0x01',
        alice,
        'test',
        ['one', 'two', 'three'],
        PollType.WEIGHTED,
        0
      )

      expect(poll).to.not.be.undefined
      if (poll) {
        expect(poll.owner).to.eq(alice.address)
        expect(poll.endTime).to.eq(poll.timestamp + 100000000)
        expect(poll.answers).to.deep.eq(['one', 'two', 'three'])
        expect(poll.minToken).to.be.undefined
        expect(poll.pollType).to.eq(PollType.WEIGHTED)
        expect(poll.question).to.eq('test')

        expect(poll.signature).to.eq('0x01')
      }
    })

    it('success NON_WEIGHTED', async () => {
      const poll = await PollInitMsg._createWithSignFunction(
        async () => '0x01',
        alice,
        'test',
        ['one', 'two', 'three'],
        PollType.NON_WEIGHTED,
        0,
        BigNumber.from(123)
      )
      expect(poll).to.not.be.undefined
      expect(poll?.minToken?.toNumber()).to.eq(123)
      if (poll) {
        expect(poll.signature).to.eq('0x01')
      }
    })

    it('NON_WEIGHTED no minToken', async () => {
      const poll = await PollInitMsg._createWithSignFunction(
        async () => '0x01',
        alice,
        'test',
        ['one', 'two', 'three'],
        PollType.NON_WEIGHTED,
        0
      )

      expect(poll?.minToken?.toNumber()).to.eq(1)
      expect(poll).to.not.be.undefined
      if (poll) {
        expect(poll.signature).to.eq('0x01')
      }
    })

    it('specific end time', async () => {
      const poll = await PollInitMsg._createWithSignFunction(
        async () => '0x01',
        alice,
        'test',
        ['one', 'two', 'three'],
        PollType.NON_WEIGHTED,
        0,
        undefined,
        100
      )

      expect(poll?.endTime).to.eq(100)
    })
  })
  describe('decode/encode', () => {
    it('success', async () => {
      const data = await PollInitMsg._createWithSignFunction(
        async () => '0x01',
        alice,
        'whats up',
        ['ab', 'cd', 'ef'],
        PollType.WEIGHTED,
        0
      )
      expect(data).to.not.be.undefined
      if (data) {
        const payload = data.encode()
        expect(payload).to.not.be.undefined
        if (payload) {
          expect(PollInitMsg.decode(payload, new Date(data.timestamp), 0, () => true)).to.deep.eq(data)
        }
      }
    })

    it('random decode', async () => {
      expect(PollInitMsg.decode(new Uint8Array([12, 12, 3, 32, 31, 212, 31, 32, 23]), new Date(10), 0)).to.be.undefined
    })

    it('NON_WEIGHTED init', async () => {
      const data = await PollInitMsg._createWithSignFunction(
        async () => '0x01',
        alice,
        'whats up',
        ['ab', 'cd', 'ef'],
        PollType.NON_WEIGHTED,
        0,
        BigNumber.from(10)
      )
      expect(data).to.not.be.undefined
      if (data) {
        const payload = data.encode()
        expect(payload).to.not.be.undefined
        if (payload) {
          expect(PollInitMsg.decode(payload, new Date(data.timestamp), 0, () => true)).to.deep.eq(data)
        }
      }
    })

    it('NON_WEIGHTED no min token', async () => {
      const data = await PollInitMsg._createWithSignFunction(
        async () => '0x01',
        alice,
        'whats up',
        ['ab', 'cd', 'ef'],
        PollType.NON_WEIGHTED,
        0
      )
      expect(data).to.not.be.undefined
      if (data) {
        const payload = data.encode()

        expect(payload).to.not.be.undefined
        if (payload) {
          expect(PollInitMsg.decode(payload, new Date(data.timestamp), 0, () => true)).to.deep.eq({
            ...data,
            minToken: BigNumber.from(1),
          })
        }
      }
    })
  })
})
