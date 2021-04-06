import { makeMockChainFn } from './makeMockChainFn'

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
    it('returns mock function', () => {
      const mockFn = jest.fn()

      const { mockChainFn } = makeMockChainFn({
        mockPropertyReturns: { myCall: { value: mockFn } },
      })

      mockChainFn.myCall()
      expect(mockFn).toHaveBeenCalled()
    })
  })
})

describe('makeMockChainFn: value call', () => {
  const doSetup = () => {
    return makeMockChainFn({
      mockPropertyReturns: { myProperty: {} },
    })
  }

  it('returns mock chain fn on arbitraty property call', () => {
    const { mockChainFn } = doSetup()

    const result = mockChainFn.myProperty
    expect(result).toBe(mockChainFn)
  })

  it('captures property call', () => {
    const { mockChainFn, calls } = doSetup()

    mockChainFn.myProperty
    const expectedCall = {
      key: 'myProperty',
      type: 'value',
    }
    expect(calls).toEqual([expectedCall])
  })

  describe('with own return value', () => {
    const doSetup2 = () => {
      return makeMockChainFn({
        mockPropertyReturns: { myProperty: { value: 'abc' } },
      })
    }

    it('returns value specified', () => {
      const { mockChainFn } = doSetup2()

      const result = mockChainFn.myProperty
      expect(result).toEqual('abc')
    })

    it('captures property call', () => {
      const { mockChainFn, calls } = doSetup2()

      mockChainFn.myProperty
      const expectedCall = {
        key: 'myProperty',
        type: 'value',
        value: 'abc',
      }
      expect(calls).toEqual([expectedCall])
    })
  })
})
