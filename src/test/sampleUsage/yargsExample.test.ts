import { yargsExample } from './yargsExample'
import { makeMockChainFn } from '../../makeMockChainFn/makeMockChainFn'

describe('yargsExample', () => {
  const doTest = () => {
    const mockPropertyReturns = { argv: { value: { some: 'object' } } }
    return makeMockChainFn({
      mockPropertyReturns,
    })
  }

  it('matches snapshot', () => {
    const { mockChainFn: yargs, calls } = doTest()

    yargsExample(yargs)
    expect(calls).toMatchSnapshot()
  })

  it('returns correct result', () => {
    const { mockChainFn: yargs } = doTest()

    const result = yargsExample(yargs)
    const expectedResult = { some: 'object' }
    expect(result).toEqual(expectedResult)
  })
})
