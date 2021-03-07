import { ChildProcess, spawn } from 'child_process';
import { Readable } from 'stream';
import { getSpawnArgs, stopProcess } from './processHelper';
import { SettingsHelper } from './settingsHelper';

export interface RaspiStream {
  start: () => Promise<void>;
  stop: () => void;
  restart: () => Promise<void>;
  stream: () => Readable | null | undefined;
}

/**
 * RaspiVid
 */
const raspiStream = (settingsHelper: SettingsHelper): RaspiStream => {
  let process: ChildProcess | undefined;

  /**
   * Start raspivid stream
   */
  const start = (): Promise<void> => {
    const { camera, preview, stream } = settingsHelper;
    const overrideSettings = { timeout: 0, profile: 'baseline', inline: true, output: '-' };

    const spawnArgs = getSpawnArgs({
      ...camera.convert(),
      ...preview.convert(),
      ...stream.convert(),
      ...overrideSettings,
    });

    console.info('raspistream', spawnArgs.join(' '));

    return new Promise((resolve) => {
      process = spawn('raspivid', [...spawnArgs], { stdio: ['ignore', 'pipe', 'inherit'] });
      process.stdout?.once('data', () => resolve());
      process.on('error', (e) => {
        console.error('raspistream - error', e.message);
        // Check reject - is it necessary?
        resolve();
      });
    });
  };

  /**
   * Return the process output
   */
  const stream = () => process?.stdout;

  /**
   * Stop the stream
   */
  const stop = () => stopProcess(process);

  /**
   * Restart - only if already running
   */
  const restart = async () => {
    if (process) {
      stop();
      await start();
    }
  };

  return { start, stop, stream, restart };
};

export default raspiStream;
