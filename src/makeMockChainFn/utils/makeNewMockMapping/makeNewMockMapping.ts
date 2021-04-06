import { BulilderMockInternalStateType, CallFnType } from '../../typedefs'

export const makeNewMockMapping = (
  builderMockInternalState: BulilderMockInternalStateType
) => (property: string, receiver: Object): void => {
  const { calls, mocks } = builderMockInternalState

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
