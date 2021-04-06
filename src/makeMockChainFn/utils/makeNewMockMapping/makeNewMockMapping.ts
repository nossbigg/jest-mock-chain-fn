import { MockChainFnInternalStateType, CallFnType } from '../../typedefs'

export const makeNewMockMapping = (
  mockChainFnInternalState: MockChainFnInternalStateType
) => (property: string, receiver: Object): void => {
  const { calls, mocks } = mockChainFnInternalState

  const newMockFn = jest.fn()
  newMockFn.mockImplementation((...args) => {
    const callEntry: CallFnType = {
      key: property,
      type: 'function',
      args,
    }
    calls.push(callEntry)

    return receiver
  })

  mocks[property] = newMockFn
}
