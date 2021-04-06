import { chalkExample } from './chalkExample'
import { makeMockChainFn } from '../../makeMockChainFn/makeMockChainFn'

describe('chalkExample', () => {
  const doTest = () => {
    const mockRedFn = jest.fn()
    mockRedFn.mockReturnValue('some-chalk-result')

    const mockPropertyReturns = {
      bold: {},
      red: { value: mockRedFn },
    }
    return makeMockChainFn({
      mockPropertyReturns,
    })
  }

  it('matches snapshot', () => {
    const { mockChainFn: chalk, calls } = doTest()

    chalkExample(chalk)
    expect(calls).toMatchSnapshot()
  })

  it('returns correct result', () => {
    const { mockChainFn: chalk } = doTest()

    const result = chalkExample(chalk)
    const expectedResult = 'some-chalk-result'
    expect(result).toEqual(expectedResult)
  })
})
