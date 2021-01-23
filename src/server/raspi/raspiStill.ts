import { ChildProcess, spawn } from 'child_process';
import { RaspiStillOptions } from '../../shared/raspiOptions';
import { getSpawnArgs, stopProcess } from './processHelper';

export interface RaspiStill {
  start: (options: Partial<RaspiStillOptions>) => Promise<void>;
  stop: () => void;
}

/**
 * RaspiVid
 */
const raspiStill = (baseOptions: Partial<RaspiStillOptions>): RaspiStill => {
  let process: ChildProcess | undefined;

  /**
   * Capture image
   */
  const start = (newOptions: Partial<RaspiStillOptions>): Promise<void> => {
    const spawnArgs = getSpawnArgs({ ...baseOptions, ...newOptions });
    console.info('raspistill', spawnArgs.join(' '));

    // Spawn the raspiStill
    return new Promise((resolve, reject) => {
      process = spawn('raspistill', [...spawnArgs], {});
      process.stdout?.on('data', (data) => console.log('raspistill', data));
      process.on('exit', () => resolve());
      process.on('error', () => reject());
    });
  };

  /**
   * Stop the process
   */
  const stop = () => stopProcess(process);

  return { start, stop };
};

export default raspiStill;
