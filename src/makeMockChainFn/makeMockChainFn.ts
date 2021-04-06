import { JestMockChainFnInternalState } from './constants'
import { makeNewMockMapping } from './utils'
import {
  BulilderMockInternalStateType,
  CallValueType,
  MakeBuilderMockOptions,
  MakeMockChainFnReturnType,
} from './typedefs'

export const makeMockChainFn = (
  options: MakeBuilderMockOptions = {}
): MakeMockChainFnReturnType => {
  const { mockPropertyReturns = {} } = options

  const builderMockInternalState: BulilderMockInternalStateType = {
    mocks: {},
    calls: [],
  }
  const { mocks, calls } = builderMockInternalState

  const builderMock = {
    [JestMockChainFnInternalState]: builderMockInternalState,
  }

  const builderMockHandler: ProxyHandler<any> = {
    get: function (_, _prop, receiver) {
      // allow access to internal state
      if (_prop === JestMockChainFnInternalState) {
        return builderMock[JestMockChainFnInternalState]
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
        makeNewMockMapping(builderMockInternalState)(property, receiver)
      }

      // return fn mock
      return mocks[property]
    },
  }

  const mockChainFn = new Proxy(builderMock, builderMockHandler)
  return { mockChainFn, calls, mocks }
}
