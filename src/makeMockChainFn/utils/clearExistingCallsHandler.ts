import { CallsAccumulatorType } from '../typedefs'

export const clearExistingCallsHandler = (
  calls: CallsAccumulatorType
) => (): void => {
  while (calls.length > 0) {
    calls.pop()
  }
}
