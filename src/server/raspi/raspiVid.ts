import { ChildProcess, spawn } from 'child_process';
import path from 'path';
import { getIsoDataTime } from '../../shared/helperFunctions';
import { getSpawnArgs, stopProcess } from './processHelper';
import { PhotosAbsPath, SettingsHelper } from './settingsHelper';

export interface RaspiVid {
  start: () => Promise<string>;
  stop: () => void;
}

/**
 * RaspiVid
 */
const raspiVid = (settingsHelper: SettingsHelper): RaspiVid => {
  let process: ChildProcess | undefined;

  /**
   * Start recording
   */
  const start = (): Promise<string> => {
    const { camera, preview, vid } = settingsHelper;
    const overrideSetting = {};

    const settings = {
      ...camera.convert(),
      ...preview.convert(),
      ...vid.convert(),
      ...overrideSetting,
    };

    const fileBaseName = getIsoDataTime();
    const fileExtension = 'h264';
    const fileName = `${fileBaseName}.${fileExtension}`;

    const spawnArgs = getSpawnArgs({
      ...settings,
      output: path.join(PhotosAbsPath, fileName),
    });

    console.info('raspivid', spawnArgs.join(' '));
    return new Promise<string>((resolve, reject) => {
      process = spawn('raspivid', [...spawnArgs]);
      process.on('error', reject);
      process.on('exit', () => resolve(fileName));
    });
  };

  /**
   * Stop recording
   */
  const stop = () => stopProcess(process);

  return { start, stop };
};

export default raspiVid;
