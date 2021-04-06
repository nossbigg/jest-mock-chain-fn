import { JestMockChainFnInternalState } from './constants'
import {
  clearExistingCallsHandler,
  clearExistingMocksHandler,
  makeProxyHandler,
} from './utils'
import {
  MockChainFnInternalStateType,
  MakeMockChainFnOptions,
  MakeMockChainFnReturnType,
  MocksMappingType,
  CallsAccumulatorType,
} from './typedefs'

export const makeMockChainFn = (
  options: MakeMockChainFnOptions = {}
): MakeMockChainFnReturnType => {
  const mocks: MocksMappingType = {}
  const calls: CallsAccumulatorType = []
  const mockChainFnInternalState: MockChainFnInternalStateType = {
    mocks,
    calls,
  }
  const mockChainFnObject = {
    [JestMockChainFnInternalState]: mockChainFnInternalState,
  }

  const mockChainFnProxyHandler = makeProxyHandler({
    options,
    mockChainFnObject,
  })
  const mockChainFnWithProxy = new Proxy(
    mockChainFnObject,
    mockChainFnProxyHandler
  )

  return {
    mockChainFn: mockChainFnWithProxy,
    calls,
    mocks,
    clearExistingCalls: clearExistingCallsHandler(calls),
    clearExistingMocks: clearExistingMocksHandler(mocks),
  }
}
