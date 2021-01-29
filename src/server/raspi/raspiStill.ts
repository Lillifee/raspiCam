import { ChildProcess, spawn } from 'child_process';
import { stillSettings } from '../../shared/raspiSettings';
import { getSpawnArgs, stopProcess } from './processHelper';
import { SettingsHelper } from './settingsHelper';

export interface RaspiStill {
  start: () => Promise<void>;
  stop: () => void;
}

/**
 * RaspiVid
 */
const raspiStill = (settingsHelper: SettingsHelper): RaspiStill => {
  let process: ChildProcess | undefined;

  /**
   * Start video capture
   */
  const start = (): Promise<void> => {
    const { camera, preview, still } = settingsHelper;
    const spawnArgs = getSpawnArgs({
      ...stillSettings,
      ...camera.get(),
      ...preview.get(),
      ...still.get(),
    });

    console.info('raspistill', spawnArgs.join(' '));

    // Spawn the raspiStill
    return new Promise((resolve, reject) => {
      process = spawn('raspistill', [...spawnArgs], {});
      process.stdout?.on('data', (data) => console.log('raspistill', data));
      process.on('exit', () => resolve());
      process.on('error', (e) => reject(e));
    });
  };

  /**
   * Stop video capture
   */
  const stop = () => stopProcess(process);

  return { start, stop };
};

export default raspiStill;
