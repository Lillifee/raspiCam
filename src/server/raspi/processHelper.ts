import { ChildProcess, exec } from 'child_process';
import path from 'path';
import { PhotosAbsPath, PhotosPath } from './settingsHelper';

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
        result.push(value.toString());
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

/**
 * Extract thumbnail using exiv2
 */
export const extractThumbnail = async (
  fileBaseName: string,
  fileExtension: string,
): Promise<string> => {
  const filePath = path.join(PhotosAbsPath, `${fileBaseName}.${fileExtension}`);
  const thumbnailPath = path.join(PhotosPath, `${fileBaseName}-preview1.${fileExtension}`);

  return new Promise((resolve, reject) =>
    exec(`exiv2 -ep1 ${filePath}`, (err, _, stderr) => {
      err || stderr ? reject(err || stderr) : resolve(thumbnailPath);
    }),
  );
};
