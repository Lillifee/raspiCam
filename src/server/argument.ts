import yargs from 'yargs/yargs';

export const parseArguments = () =>
  yargs(process.argv.slice(2))
    .options({
      p: { type: 'number', alias: 'port', default: 8000 },
      c: { type: 'boolean', alias: 'cors', default: false },
    })
    .parseSync();

export type Arguments = ReturnType<typeof parseArguments>;
