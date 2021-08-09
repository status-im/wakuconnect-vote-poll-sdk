import { expect } from 'chai'
import { Waku } from 'js-waku'
import WakuVoting from '../src'

describe('WakuVoting', () => {
  it('success', async () => {
    const wakuVoting = new WakuVoting('test', '0x0', {} as unknown as Waku)

    expect(wakuVoting).to.not.be.undefined
  })
})
