import { ChildProcess } from 'child_process';

/**
 * Helper function to transform a object to process arguments.
 */
export const getSpawnArgs = <T>(options: T): string[] =>
  Object.entries(options).reduce<string[]>((result, [key, value]) => {
    result.push(`--${key}`);

    if (value !== undefined && value !== true) {
      result.push(escape(value.toString()));
    }
    return result;
  }, []);

/**
 * Stop the Process
 */
export const stopProcess = (process?: ChildProcess): void => {
  if (process) {
    process.stdout?.pause();
    process.unref();
    process.kill();
    process = undefined;
  }
};
