import { MocksMappingType } from '../typedefs'

export const clearExistingMocksHandler = (
  mocks: MocksMappingType
) => (): void => {
  Object.keys(mocks).forEach((key) => {
    delete mocks[key]
  })
}
