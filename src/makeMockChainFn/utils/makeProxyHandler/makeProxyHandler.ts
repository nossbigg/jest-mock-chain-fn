import { makeNewMockMapping } from '..'
import { JestMockChainFnInternalState } from '../../constants'
import {
  CallValueType,
  MakeMockChainFnOptions,
  MockChainFnInternalStateType,
} from '../../typedefs'

type MakeProxyHandlerArgs = {
  options: MakeMockChainFnOptions
  // not very good support for Symbol types
  mockChainFnObject: any
}

export const makeProxyHandler = (args: MakeProxyHandlerArgs) => {
  const { options = {}, mockChainFnObject } = args
  const { mockPropertyReturns = {} } = options

  const mockChainFnInternalState: MockChainFnInternalStateType =
    mockChainFnObject[JestMockChainFnInternalState]
  const { mocks, calls } = mockChainFnInternalState

  const proxyHandler: ProxyHandler<any> = {
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

  return proxyHandler
}
