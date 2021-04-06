import { JestMockChainFnInternalState } from './constants'
import { makeProxyHandler } from './utils'
import {
  MockChainFnInternalStateType,
  MakeMockChainFnOptions,
  MakeMockChainFnReturnType,
} from './typedefs'

export const makeMockChainFn = (
  options: MakeMockChainFnOptions = {}
): MakeMockChainFnReturnType => {
  const mockChainFnInternalState: MockChainFnInternalStateType = {
    mocks: {},
    calls: [],
  }
  const { mocks, calls } = mockChainFnInternalState

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
  return { mockChainFn: mockChainFnWithProxy, calls, mocks }
}
