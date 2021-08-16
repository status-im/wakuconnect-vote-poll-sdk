import { expect } from 'chai'
import { PollType } from '../../../src/types/PollType'
import PollInit from '../../../src/utils/proto/PollInit'
import { BigNumber } from 'ethers'
import { PollInitMsg } from '../../../src/models/PollInitMsg'
import { MockProvider } from 'ethereum-waffle'

describe('PollInit', () => {
  const provider = new MockProvider()
  const [alice] = provider.getWallets()
  it('success', async () => {
    const data = await PollInitMsg._createWithSignFunction(
      async (e) => new PollInitMsg('0x01', e),
      alice,
      'whats up',
      ['ab', 'cd', 'ef'],
      PollType.WEIGHTED
    )
    expect(data).to.not.be.undefined
    if (data) {
      const payload = PollInit.encode(data)
      expect(payload).to.not.be.undefined
      if (payload) {
        expect(PollInit.decode(payload, new Date(data.timestamp), () => alice.address)).to.deep.eq(data)
      }
    }
  })

  it('random decode', async () => {
    expect(PollInit.decode(new Uint8Array([12, 12, 3, 32, 31, 212, 31, 32, 23]), new Date(10))).to.be.undefined
  })

  it('random data', async () => {
    expect(PollInit.encode({ sadf: '0x0' } as unknown as PollInitMsg)).to.be.undefined
  })

  it('NON_WEIGHTED init', async () => {
    const data = await PollInitMsg._createWithSignFunction(
      async (e) => new PollInitMsg('0x01', e),
      alice,
      'whats up',
      ['ab', 'cd', 'ef'],
      PollType.NON_WEIGHTED,
      BigNumber.from(10)
    )
    expect(data).to.not.be.undefined
    if (data) {
      const payload = PollInit.encode(data)
      expect(payload).to.not.be.undefined
      if (payload) {
        expect(PollInit.decode(payload, new Date(data.timestamp), () => alice.address)).to.deep.eq(data)
      }
    }
  })

  it('NON_WEIGHTED no min token', async () => {
    const data = await PollInitMsg._createWithSignFunction(
      async (e) => new PollInitMsg('0x01', e),
      alice,
      'whats up',
      ['ab', 'cd', 'ef'],
      PollType.NON_WEIGHTED
    )
    expect(data).to.not.be.undefined
    if (data) {
      const payload = PollInit.encode(data)

      expect(payload).to.not.be.undefined
      if (payload) {
        expect(PollInit.decode(payload, new Date(data.timestamp), () => alice.address)).to.deep.eq({
          ...data,
          minToken: BigNumber.from(1),
        })
      }
    }
  })
})
