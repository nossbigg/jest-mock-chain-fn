import { makeMockChainFn } from '../../makeMockChainFn'

describe('makeMockChainFn: function call', () => {
  const doSetup = () => {
    return makeMockChainFn()
  }

  it('returns mock chain fn on arbitraty function call', () => {
    const { mockChainFn } = doSetup()

    const result = mockChainFn.myCall()
    expect(result).toBe(mockChainFn)
  })

  it('captures function call', () => {
    const { mockChainFn, calls } = doSetup()

    mockChainFn.myCall(1, { a: 1 }, 'welp', () => {})
    const expectedCall = {
      key: 'myCall',
      type: 'function',
      args: [1, { a: 1 }, 'welp', expect.any(Function)],
    }
    expect(calls).toEqual([expectedCall])
  })

  describe('with own return value', () => {
    const doSetup2 = () => {
      const ownMockFn = jest.fn()
      ownMockFn.mockReturnValue('xyz')

      const makeMockChainFnReturn = makeMockChainFn({
        mockPropertyReturns: { myCall: { value: ownMockFn } },
      })

      return { ownMockFn, makeMockChainFnReturn }
    }

    it('returns result of mock function', () => {
      const { makeMockChainFnReturn } = doSetup2()
      const { mockChainFn } = makeMockChainFnReturn

      const result = mockChainFn.myCall(1, 2)
      expect(result).toEqual('xyz')
    })

    it('calls mock function', () => {
      const { ownMockFn, makeMockChainFnReturn } = doSetup2()
      const { mockChainFn } = makeMockChainFnReturn

      mockChainFn.myCall(1, 2)
      expect(ownMockFn).toHaveBeenCalledWith(1, 2)
    })

    it('captures function call', () => {
      const { makeMockChainFnReturn } = doSetup2()
      const { mockChainFn, calls } = makeMockChainFnReturn

      mockChainFn.myCall(1, 2)

      const expectedCall = {
        key: 'myCall',
        type: 'function',
        args: [1, 2],
      }
      expect(calls).toEqual([expectedCall])
    })
  })
})
