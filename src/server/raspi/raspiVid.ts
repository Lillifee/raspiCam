import { ChildProcess, spawn } from 'child_process';
import { RaspiVidOptions } from '../../shared/raspiOptions';
import { getSpawnArgs, stopProcess } from './processHelper';

export interface RaspiVid {
  start: (newOptions?: Partial<RaspiVidOptions>) => void;
  stop: () => void;
}

/**
 * RaspiVid
 */
const raspiVid = (baseOptions?: Partial<RaspiVidOptions>): RaspiVid => {
  let process: ChildProcess | undefined;

  /**
   * Start recording
   */
  const start = (newOptions?: Partial<RaspiVidOptions>) => {
    const options = { ...baseOptions, ...newOptions };

    const spawnArgs = getSpawnArgs(options);
    console.info('raspivid', spawnArgs.join(' '));

    // Spawn the raspivid with -ih (Insert PPS, SPS headers) - see end of the file
    process = spawn('raspivid', [...spawnArgs]);
    process.on('error', (e) => {
      console.error('raspivid - error', e.message);
    });
  };

  /**
   * Stop recording
   */
  const stop = () => stopProcess(process);

  return { start, stop };
};

export default raspiVid;
