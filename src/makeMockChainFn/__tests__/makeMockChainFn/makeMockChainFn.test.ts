import { JestMockChainFnInternalState } from '../../constants'
import { makeMockChainFn } from '../../makeMockChainFn'

describe('makeMockChainFn', () => {
  it('clears calls', () => {
    const { mockChainFn, calls, clearExistingCalls } = makeMockChainFn()
    mockChainFn.someFunction()

    clearExistingCalls()

    expect(calls).toEqual([])
  })

  it('clears existing mock mappings', () => {
    const { mockChainFn, mocks, clearExistingMocks } = makeMockChainFn()
    mockChainFn.someFunction()

    clearExistingMocks()

    expect(mocks).toEqual({})
  })

  it('clears calls of existing mocks', () => {
    const { mockChainFn, mocks } = makeMockChainFn()
    mockChainFn.someFunction()

    jest.clearAllMocks()

    const mockFn = mocks['someFunction']
    expect(mockFn).not.toHaveBeenCalled()
  })

  it('allows access to internal state via symbol', () => {
    const { mockChainFn } = makeMockChainFn()

    const result = mockChainFn[JestMockChainFnInternalState as any]
    const expectedResult = {
      mocks: expect.any(Object),
      calls: expect.any(Array),
    }
    expect(result).toEqual(expectedResult)
  })
})
