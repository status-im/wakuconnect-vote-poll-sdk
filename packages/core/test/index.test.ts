import { expect } from 'chai'
import { foo } from '../src'

describe('test', () => {
  it('foo', async () => {
    expect(foo()).to.eq('Hello world')
  })
  it('not foo', async () => {
    expect(foo()).to.not.eq('asdas')
  })
})
