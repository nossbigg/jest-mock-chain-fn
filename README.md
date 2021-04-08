# jest-mock-chain-fn

[![npm version](https://badge.fury.io/js/jest-mock-chain-fn.svg)](https://badge.fury.io/js/jest-mock-chain-fn)

Easier testing with chained functions + jest 🧪

⭐️ Also allows snapshot testing with chained functions! ⭐️

# Who's it for?

1. You use libraries that use **method chaining** (eg. [yargs](https://github.com/yargs/yargs), [chalk](https://github.com/chalk/chalk))
    - eg. `someItem.setPrice(2).setQuantity(5)`
    - see more: [Method Chaining](https://en.wikipedia.org/wiki/Method_chaining)
1. You need unit tests to assert that these **chained methods are called correctly**
1. You would like to **mock away the actual implementation** for ease of testing
1. You **don't want to write so much setup code** for testing libraries that use method chaining

_Related concepts:_ [Builder Design Pattern](https://sourcemaking.com/design_patterns/builder), [Fluent Interface](https://martinfowler.com/bliki/FluentInterface.html)

# Scenario

```javascript
// yargsExample.ts
// as per example usage on: https://yargs.js.org/
export const yargsExample = (yargs: any) => {
  const result = yargs
    .scriptName('pirate-parser')
    .usage('$0 <cmd> [args]')
    .command(
      'hello [name]',
      'welcome ter yargs!',
      (yargs: any) => {
        yargs.positional('name', {
          type: 'string',
          default: 'Cambi',
          describe: 'the name to say hello to',
        })
      },
      function (argv: any) {
        console.log('hello', argv.name, 'welcome to yargs!')
      }
    )
    .help().argv

  return result
}
```

Scenario: 
- System Under Test is `yargsExample()`
- When `yargsExample()` is called,
- Then we expect that `yargs` has been called with:
  - `scriptName()` with args `['pirate-parser']`
  - `usage()` with args `['$0 <cmd> [args]']`
  - ... (rest of chained functions)
  - Returned value from `.argv`

# Usage

```javascript
// 1. import makeMockChainFn()
import { makeMockChainFn } from 'jest-mock-chain-fn'

// 2. import function under test
import { yargsExample } from './yargsExample'

test('asserts chained fn is called correctly', () => {
  // 3. set .argv to return mock object
  const mockPropertyReturns = { argv: { value: { some: 'object' } } }

  // 4. create mock chain fn
  const { mockChainFn: yargs, calls } = makeMockChainFn({
    mockPropertyReturns,
  })

  // 5. trigger usage of top-level function
  const result = yargsExample(yargs)

  // 7. assert chain fn calls against snapshot
  expect(calls).toMatchSnapshot()

  // 8. assert return value
  expect(result).toEqual({ some: 'object' })
})
```

Key point: With **minimal setup**, we are able to:

1. **Capture all calls** made to `yargs`
2. **Assert calls against a snapshot**! 

_No more tedious handwiring of mocks to test method chaining._ 🙃 

<details markdown="1">
<summary>Example: calls</summary>

```javascript
[
    { key: 'scriptName', type: 'function', args: [ 'pirate-parser' ] },
    { key: 'usage', type: 'function', args: [ '$0 <cmd> [args]' ] },
    {
        key: 'command',
        type: 'function',
        args: [ 'hello [name]', 'welcome ter yargs!', [Function], [Function] ]
    },
    { key: 'help', type: 'function', args: [] },
    { key: 'argv', type: 'value', value: { some: 'object' } }
]
```

</details>


See more: [yargsExample.test.ts](/src/test/sampleUsage/yargsExample.test.ts), [chalkExample.test.ts](/src/test/sampleUsage/chalkExample.test.ts)

# API

```javascript
const options = {
  // optional: sets overrides for specific property keys
  mockPropertyReturns: { somePropName: {} },
}

const result = makeMockChainFn(options)

const {
  // mock that accepts method/property calls against it
  mockChainFn,
  // map of mock fns (automatically created upon call against mockChainFn)
  mocks,
  // list of calls made against mockChainFn
  calls,
  // clears mocks mapping
  clearExistingMocks,
  // clears list of calls
  clearExistingCalls,
} = result
```

See more: [makeMockChainFn.ts](/src/makeMockChainFn/makeMockChainFn.ts)

### `mockPropertyReturns`

Used to define non-standard mock function behaviors upon property call

_For: Chained function (Default scenario)_

- By default, `mockChainFn` supports method chaining. (ie. no `mockPropertyReturns` setup required)
- Upon calling any arbitrary property (eg. `mockChainFn.myCall()`), library creates a mapping for `myCall` in `mocks`, 
- The corresponding value for the `myCall`key is a `jest.fn()` that captures all calls and returns `mockChainFn()` (to support method chaining).

_For: Chained value (non-function)_

- In order to support chained value (non-function) calls (eg. `mockChainFn.compute.save`),
- Need to set `mockPropertyReturns = { compute: {}, save: {} }`

_For: Property with fixed value (function)_

- Supports returning of fixed value (function) against a given property (eg. `mockChainFn.myCall()`)
- Useful to provide own mock functions for customizable behvaior for a given function
- Eg. We want a function call to call our own mock function and return the result of our mock function
- Need to set `mockPropertyReturns = { myCall: { value: jest.fn() } }` (where `jest.fn()` is your own mock)
- Note: In this mode, a call against `myCall` will still be captured into `calls`

_For: Property with fixed value (non-function)_

- Supports returning of fixed value (non-function) against a given property (eg. `mockChainFn.someProperty`)
- Eg. We want a property call to return a mock value
- Need to set `mockPropertyReturns = { someProperty: { value: 'own value' } }`

# Tips

- Calling `jest.resetAllMocks()` will clear `jest.fn()` mock functions that are used internally within `mockChainFn` (ie. in `mocks` mapping)
- If you want your own mock function to continue chaining, just set the return value to `mockChainFn`
- When defining own mock function to pass to given property, if own mock function throws error, it will be propagated upwards (ie. library does not swallow errors)
