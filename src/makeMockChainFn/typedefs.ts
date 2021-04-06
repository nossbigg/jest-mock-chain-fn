export type BulilderMockInternalStateType = {
  mocks: Record<string, jest.Mock>
  calls: CallsType[]
}

export type MakeBuilderMockOptions = {
  mockPropertyReturns?: Record<string, MockPropertyReturnsEntry>
}
export type MockPropertyReturnsEntry = { value?: any }

export type MakeMockChainFnReturnType = {
  mockChainFn: Record<string, any>
  mocks: Record<string, jest.Mock>
  calls: CallsType[]
}

export type CallsType = CallFnType | CallValueType
export type CallFnType = { key: string | symbol; type: 'function'; args: any[] }
export type CallValueType = { key: string | symbol; type: 'value'; value?: any }
