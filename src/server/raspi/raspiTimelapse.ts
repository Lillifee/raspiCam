import { ChildProcess, spawn } from 'child_process';
import path from 'path';
import { getIsoDataTime } from '../../shared/helperFunctions';
import { extractThumbnail, getSpawnArgs, stopProcess } from './processHelper';
import { PhotosAbsPath, SettingsHelper } from './settingsHelper';

export interface RaspiTimelapse {
  start: () => Promise<string>;
  stop: () => void;
}

/**
 * RaspiTimelapse
 */
const raspiTimelapse = (settingsHelper: SettingsHelper): RaspiTimelapse => {
  let process: ChildProcess | undefined;

  /**
   * Start photo capture
   */
  const start = (): Promise<string> => {
    const { camera, preview, timelapse } = settingsHelper;
    const overrideSetting = { thumb: '320:240:35' }; // TODO calculate}

    const settings = {
      ...camera.convert(),
      ...preview.convert(),
      ...timelapse.convert(),
      ...overrideSetting,
    };

    const fileBaseName = getIsoDataTime();
    const fileExtension = settings.encoding || 'jpg';
    const fileCounter = settings.timelapse ? `-%04d` : '';
    const fileName = `${fileBaseName}${fileCounter}.${fileExtension}`;

    const spawnArgs = getSpawnArgs({
      ...settings,
      output: path.join(PhotosAbsPath, fileName),
    });

    console.info('raspistill', spawnArgs.join(' '));

    // Spawn the raspiStill
    return new Promise<string>((resolve, reject) => {
      process = spawn('raspistill', [...spawnArgs], {});
      process.stdout?.on('data', (data) => console.log('raspistill', data));
      process.on('exit', () =>
        extractThumbnail(`${fileBaseName}${fileCounter ? '-0001' : ''}`, fileExtension)
          .then(resolve)
          .catch(reject),
      );
      process.on('error', (e) => reject(e));
    });
  };

  /**
   * Stop photo capture
   */
  const stop = () => stopProcess(process);

  return { start, stop };
};

export default raspiTimelapse;
