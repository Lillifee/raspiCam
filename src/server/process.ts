import { ChildProcess, StdioOptions, spawn } from 'child_process';
import { PassThrough } from 'stream';
import { createLogger } from './logger';

const logger = createLogger('process');

/**
 * Helper function to transform a object to process arguments.
 */
const getSpawnArgs = (options: Record<string, unknown>): string[] =>
  Object.entries(options).reduce<string[]>((result, [key, value]) => {
    if (value !== undefined) {
      if (typeof value === 'boolean') {
        if (value === true) result.push(`--${key}`);
      }
      if (typeof value === 'string' || typeof value === 'number') {
        result.push(`--${key}`);
        result.push(value.toString());
      }
    }
    return result;
  }, []);

export type SpawnArgs = Record<string, unknown> & { output: string };

export interface SpawnParameters {
  command: string;
  args: SpawnArgs;
}

export interface SpawnProcess {
  start: (command: string, args: SpawnArgs) => Promise<void>;
  stop: () => void;
  running: () => boolean;
  parameters: () => SpawnParameters | undefined;
  stream: PassThrough;
}

/**
 * Helper function to spawn the raspi processes
 */
export const spawnProcess = (options?: {
  stdioOptions?: StdioOptions;
  stream?: boolean;
}): SpawnProcess => {
  let process: ChildProcess | undefined;
  let spawnParameters: SpawnParameters | undefined;

  const stream = new PassThrough();

  const stop = () => {
    if (process) {
      process.unref();
      process.kill();
      process = undefined;
    }
  };

  const running = () => !!process;

  const parameters = () => spawnParameters;

  const start = (command: string, args: SpawnArgs): Promise<void> =>
    new Promise<void>((resolve, reject) => {
      spawnParameters = { command, args };

      const spawnArgs = getSpawnArgs(args);
      logger.log(command, spawnArgs.join(' '));

      process = spawn(command, spawnArgs, { stdio: options?.stdioOptions });
      process.on('error', (e) => reject(e));
      process.on('exit', () => resolve());

      process.stderr?.on('data', (d) => logger.log(removeNewlines(d)));

      if (options?.stream) {
        process.stdout?.once('data', () => resolve());
        process.stdout?.pipe(stream, { end: false });
      } else {
        process.stdout?.on('data', logger.info);
      }
    });

  return { start, stop, running, parameters, stream };
};

const removeNewlines = (data: unknown) => String(data).replace(/^\s+|\s+$/g, '');
