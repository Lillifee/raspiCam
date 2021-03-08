import { ChildProcess, spawn } from 'child_process';
import path from 'path';
import { getIsoDataTime } from '../../shared/helperFunctions';
import { getSpawnArgs, stopProcess } from './processHelper';
import { PhotosAbsPath, SettingsHelper } from './settingsHelper';

export interface RaspiTimelapse {
  start: () => void;
  stop: () => void;
}

/**
 * RaspiTimelapse
 */
const raspiTimelapse = (settingsHelper: SettingsHelper): RaspiTimelapse => {
  let process: ChildProcess | undefined;

  /**
   * Start timelapse capture
   */
  const start = (): void => {
    const { camera, preview, photo, timelapse } = settingsHelper;
    const overrideSetting = { thumb: '320:240:35' }; // TODO calculate}

    const settings = {
      ...camera.convert(),
      ...preview.convert(),
      ...photo.convert(),
      ...timelapse.convert(),
      ...overrideSetting,
    };

    const fileBaseName = getIsoDataTime();
    const fileExtension = settings.encoding || 'jpg';
    const fileName = `${fileBaseName}-%04d.${fileExtension}`;

    const spawnArgs = getSpawnArgs({
      ...settings,
      output: path.join(PhotosAbsPath, fileName),
    });

    console.info('raspistill', spawnArgs.join(' '));

    // Spawn the raspiStill
    process = spawn('raspistill', [...spawnArgs], {});

    process.on('error', (e) => {
      console.error('raspivid - error', e.message);
    });
  };

  /**
   * Stop photo capture
   */
  const stop = () => stopProcess(process);

  return { start, stop };
};

export default raspiTimelapse;
