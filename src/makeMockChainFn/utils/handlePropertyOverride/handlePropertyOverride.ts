import {
  CallFnType,
  CallValueType,
  MakeMockChainFnOptions,
  MockChainFnInternalStateType,
} from '../../typedefs'

type HandlePropertyOverrideArgs = {
  property: string
  receiver: any
  options: MakeMockChainFnOptions
  mockChainFnInternalState: MockChainFnInternalStateType
}

export const handlePropertyOverride = (args: HandlePropertyOverrideArgs) => {
  const { property, receiver, options, mockChainFnInternalState } = args
  const { mockPropertyReturns = {} } = options
  const { calls, mocks } = mockChainFnInternalState

  const mockPropertyReturnEntry = mockPropertyReturns[property]

  const handleNonFunctionValueScenario = (value: any) => {
    const callEntry: CallValueType = {
      key: property,
      type: 'value',
      value,
    }
    calls.push(callEntry)

    return value
  }

  const handleFunctionValueScenario = (value: Function) => {
    const newMockFn = jest.fn()
    newMockFn.mockImplementation((...args) => {
      const functionValueCallResult = value(...args)

      const callEntry: CallFnType = {
        key: property,
        type: 'function',
        args,
      }
      calls.push(callEntry)

      return functionValueCallResult
    })

    mocks[property] = newMockFn
    return newMockFn
  }

  const handleDefaultScenario = () => {
    const callEntry: CallValueType = {
      key: property,
      type: 'value',
    }
    calls.push(callEntry)

    return receiver
  }

  if ('value' in mockPropertyReturnEntry) {
    const { value } = mockPropertyReturnEntry

    if (typeof value !== 'function') {
      return handleNonFunctionValueScenario(value)
    }

    return handleFunctionValueScenario(value)
  }

  return handleDefaultScenario()
}
