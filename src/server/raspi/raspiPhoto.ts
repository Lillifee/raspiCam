import { ChildProcess, spawn } from 'child_process';
import path from 'path';
import { getIsoDataTime } from '../../shared/helperFunctions';
import { extractThumbnail, getSpawnArgs, stopProcess } from './processHelper';
import { PhotosAbsPath, SettingsHelper } from './settingsHelper';

export interface RaspiPhoto {
  start: () => Promise<string>;
  stop: () => void;
}

/**
 * RaspiPhoto
 */
const raspiPhoto = (settingsHelper: SettingsHelper): RaspiPhoto => {
  let process: ChildProcess | undefined;

  /**
   * Start photo capture
   */
  const start = (): Promise<string> => {
    const { camera, preview, photo } = settingsHelper;
    const overrideSetting = { thumb: '320:240:35' }; // TODO calculate}

    const settings = {
      ...camera.convert(),
      ...preview.convert(),
      ...photo.convert(),
      ...overrideSetting,
    };

    const fileBaseName = getIsoDataTime();
    const fileExtension = settings.encoding || 'jpg';
    const fileName = `${fileBaseName}.${fileExtension}`;

    const spawnArgs = getSpawnArgs({
      ...settings,
      output: path.join(PhotosAbsPath, fileName),
    });

    console.info('raspistill', spawnArgs.join(' '));

    // Spawn the raspiStill
    return new Promise<string>((resolve, reject) => {
      process = spawn('raspistill', [...spawnArgs], {});
      process.on('error', (e) => reject(e));
      process.on('exit', () =>
        extractThumbnail(fileBaseName, fileExtension).then(resolve).catch(reject),
      );
    });
  };

  /**
   * Stop photo capture
   */
  const stop = () => stopProcess(process);

  return { start, stop };
};

export default raspiPhoto;
