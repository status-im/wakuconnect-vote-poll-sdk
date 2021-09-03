import { MockProvider } from '@ethereum-waffle/provider'
import { expect } from 'chai'
import { Waku } from 'js-waku'
import { WakuVoting } from '../src'

describe('WakuVoting', () => {
  it('success', async () => {
    const wakuVoting = await WakuVoting.create('test', '0x0', new MockProvider(), {} as unknown as Waku)

    expect(wakuVoting).to.not.be.undefined
  })
})
