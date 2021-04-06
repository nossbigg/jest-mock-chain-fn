import { handlePropertyOverride, makeNewMockMapping } from '../index'
import { JestMockChainFnInternalState } from '../../constants'
import {
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
  const { mocks } = mockChainFnInternalState

  const proxyHandler: ProxyHandler<any> = {
    get: function (_, _prop, receiver) {
      // allow access to internal state
      if (_prop === JestMockChainFnInternalState) {
        return mockChainFnObject[JestMockChainFnInternalState]
      }

      const property = _prop as string
      // handle property overrides
      if (property in mockPropertyReturns) {
        return handlePropertyOverride({
          property,
          receiver,
          mockChainFnInternalState,
          options,
        })
      }

      // setup default method chaining mock, if missing
      if (!(property in mocks)) {
        makeNewMockMapping(mockChainFnInternalState)(property, receiver)
      }

      // return fn mock
      return mocks[property]
    },
  }

  return proxyHandler
}
