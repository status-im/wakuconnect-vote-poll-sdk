import { expect } from 'chai'
import { foo } from '@status-waku-voting/core'

describe('test react-components', () => {
  it('foo', async () => {
    expect(foo()).to.eq('Hello world')
  })
})
