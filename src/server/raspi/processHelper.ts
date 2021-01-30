import { ChildProcess } from 'child_process';

/**
 * Helper function to transform a object to process arguments.
 */
export const getSpawnArgs = <T>(options: T): string[] =>
  Object.entries(options).reduce<string[]>((result, [key, value]) => {
    if (value !== undefined) {
      if (typeof value === 'boolean') {
        if (value === true) result.push(`--${key}`);
      } else {
        result.push(`--${key}`);
        result.push(escape(value.toString()));
      }
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
