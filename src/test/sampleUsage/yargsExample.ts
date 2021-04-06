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
