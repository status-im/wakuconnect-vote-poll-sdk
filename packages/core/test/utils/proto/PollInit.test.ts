import { expect } from 'chai'
import { PollInitMsg, PollType } from '../../../src/types/PollInit'
import PollInit from '../../../src/utils/proto/PollInit'
import { BigNumber } from 'ethers'

describe('PollInit', () => {
  it('success', async () => {
    const data: PollInitMsg = {
      owner: '0x02',
      answers: ['ab', 'cd', 'ef'],
      endTime: 10,
      pollType: PollType.WEIGHTED,
      question: 'whats up',
      signature: '0x11',
      timestamp: 10,
    }

    const payload = PollInit.encode(data)

    expect(payload).to.not.be.undefined
    if (payload) {
      expect(PollInit.decode(payload)).to.deep.eq(data)
    }
  })

  it('random decode', async () => {
    expect(PollInit.decode(new Uint8Array([12, 12, 3, 32, 31, 212, 31, 32, 23]))).to.be.undefined
  })

  it('random data', async () => {
    expect(PollInit.encode({ sadf: '0x0' } as unknown as PollInitMsg)).to.be.undefined
  })

  it('NON_WEIGHTED init', async () => {
    const data: PollInitMsg = {
      owner: '0x02',
      answers: ['ab', 'cd', 'ef'],
      endTime: 10,
      pollType: PollType.NON_WEIGHTED,
      minToken: BigNumber.from(10),
      question: 'whats up',
      signature: '0x11',
      timestamp: 10,
    }
    const payload = PollInit.encode(data)
    expect(payload).to.not.be.undefined
    if (payload) {
      expect(PollInit.decode(payload)).to.deep.eq(data)
    }
  })

  it('NON_WEIGHTED no min token', async () => {
    const data: PollInitMsg = {
      owner: '0x02',
      answers: ['ab', 'cd', 'ef'],
      endTime: 10,
      pollType: PollType.NON_WEIGHTED,
      question: 'whats up',
      signature: '0x11',
      timestamp: 10,
    }

    const payload = PollInit.encode(data)

    expect(payload).to.be.undefined
  })
})
