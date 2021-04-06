export type MockChainFnInternalStateType = {
  mocks: MocksMappingType
  calls: CallsAccumulatorType
}
export type CallsAccumulatorType = CallsType[]
export type MocksMappingType = Record<string, jest.Mock>

export type MakeMockChainFnOptions = {
  mockPropertyReturns?: Record<string, MockPropertyReturnsEntry>
}
export type MockPropertyReturnsEntry = { value?: any }

export type MakeMockChainFnReturnType = {
  mockChainFn: Record<string, any>
  mocks: Record<string, jest.Mock>
  calls: CallsType[]
  clearExistingMocks: () => void
  clearExistingCalls: () => void
}

export type CallsType = CallFnType | CallValueType
export type CallFnType = { key: string | symbol; type: 'function'; args: any[] }
export type CallValueType = { key: string | symbol; type: 'value'; value?: any }
