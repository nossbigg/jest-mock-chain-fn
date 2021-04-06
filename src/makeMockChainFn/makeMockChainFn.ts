import { JestMockChainFnInternalState } from './constants'
import { makeNewMockMapping } from './utils'
import {
  MockChainFnInternalStateType,
  CallValueType,
  MakeMockChainFnOptions,
  MakeMockChainFnReturnType,
} from './typedefs'

export const makeMockChainFn = (
  options: MakeMockChainFnOptions = {}
): MakeMockChainFnReturnType => {
  const { mockPropertyReturns = {} } = options

  const mockChainFnInternalState: MockChainFnInternalStateType = {
    mocks: {},
    calls: [],
  }
  const { mocks, calls } = mockChainFnInternalState

  const mockChainFnObject = {
    [JestMockChainFnInternalState]: mockChainFnInternalState,
  }

  const mockChainFnProxyHandler: ProxyHandler<any> = {
    get: function (_, _prop, receiver) {
      // allow access to internal state
      if (_prop === JestMockChainFnInternalState) {
        return mockChainFnObject[JestMockChainFnInternalState]
      }

      const property = _prop as string
      // allow property overrides
      if (property in mockPropertyReturns) {
        const mockPropertyReturnEntry = mockPropertyReturns[property]
        if ('value' in mockPropertyReturnEntry) {
          const { value } = mockPropertyReturnEntry

          const callEntry: CallValueType = {
            key: property,
            type: 'value',
            value,
          }
          calls.push(callEntry)

          return value
        }

        const callEntry: CallValueType = {
          key: property,
          type: 'value',
        }
        calls.push(callEntry)

        return receiver
      }

      // setup default method chaining mock, if missing
      if (!mocks[property]) {
        makeNewMockMapping(mockChainFnInternalState)(property, receiver)
      }

      // return fn mock
      return mocks[property]
    },
  }

  const mockChainFnWithProxy = new Proxy(
    mockChainFnObject,
    mockChainFnProxyHandler
  )
  return { mockChainFn: mockChainFnWithProxy, calls, mocks }
}
