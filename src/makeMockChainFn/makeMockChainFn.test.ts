import { makeMockChainFn } from './makeMockChainFn'

describe('makeMockChainFn', () => {
  describe('single property', () => {
    describe('function call', () => {
      it('returns builder fn on arbitraty function call', () => {
        const { mockChainFn } = makeMockChainFn()

        const result = mockChainFn.myCall()
        expect(result).toBe(mockChainFn)
      })

      it('captures function call', () => {
        const { mockChainFn, calls } = makeMockChainFn()

        mockChainFn.myCall(1, { a: 1 }, 'welp', () => {})
        const expectedCall = {
          key: 'myCall',
          type: 'function',
          args: [1, { a: 1 }, 'welp', expect.any(Function)],
        }
        expect(calls).toEqual([expectedCall])
      })
    })

    describe('value call', () => {
      it('returns builder fn on arbitraty property call', () => {
        const { mockChainFn } = makeMockChainFn({
          mockPropertyReturns: { myProperty: {} },
        })

        const result = mockChainFn.myProperty
        expect(result).toBe(mockChainFn)
      })

      it('captures function call', () => {
        const { mockChainFn, calls } = makeMockChainFn({
          mockPropertyReturns: { myProperty: {} },
        })

        mockChainFn.myProperty
        const expectedCall = {
          key: 'myProperty',
          type: 'value',
        }
        expect(calls).toEqual([expectedCall])
      })
    })
  })

  describe('mockPropertyReturns', () => {
    it('returns mock function specified in mockPropertyReturns', () => {
      const mockFn = jest.fn()
      const { mockChainFn } = makeMockChainFn({
        mockPropertyReturns: { myCall: { value: mockFn } },
      })

      mockChainFn.myCall()
      expect(mockFn).toHaveBeenCalled()
    })

    it('returns value specified in mockPropertyReturns', () => {
      const { mockChainFn } = makeMockChainFn({
        mockPropertyReturns: { myProperty: { value: 'abc' } },
      })

      const result = mockChainFn.myProperty
      expect(result).toEqual('abc')
    })
  })
})
