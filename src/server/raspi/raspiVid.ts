import { ChildProcess, spawn } from 'child_process';
import { defaultSettings } from '../../shared/settings';
import { getSpawnArgs, stopProcess } from './processHelper';
import { SettingsHelper } from './settingsHelper';

export interface RaspiVid {
  start: () => void;
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
  const start = () => {
    const { camera, preview, stream } = settingsHelper;
    const overrideSetting = { output: 'dummy.mp4' };

    const spawnArgs = getSpawnArgs({
      ...defaultSettings.vid,
      ...camera.convert(),
      ...preview.convert(),
      ...stream.convert(),
      ...overrideSetting,
    });

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
