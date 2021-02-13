import { ChildProcess, spawn } from 'child_process';
import { Readable } from 'stream';
import { streamSettings } from '../../shared/raspiSettings';
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
    const spawnArgs = getSpawnArgs({
      ...streamSettings,
      ...camera.get(),
      ...preview.get(),
      ...stream.get(),
    });
    console.info('raspistream', spawnArgs.join(' '));

    return new Promise((resolve, reject) => {
      // Spawn the raspivid with -ih (Insert PPS, SPS headers) - see end of the file
      process = spawn('raspivid', [...spawnArgs], { stdio: ['ignore', 'pipe', 'inherit'] });
      process.stdout?.once('data', () => resolve());
      process.on('error', (e) => {
        console.error('raspistream - error', e.message);
        reject(e);
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

/**  
 * Check alternative to startup of raspivid using -ih
 * Instead of sending the SPS & PPS frames all the time, we can extract them at start,
 * remember them for the next client and send the information on web socket connection.
 
  (data: Buffer) => {
    const chunk = Buffer.concat([NALSeparator, data]);
    const chunkType = chunk[0] & 0b11111;

    // Capture the first SPS & PPS frames, so we can send stream parameters on connect.
    if (chunkType === 7 || chunkType === 8) {
      headers.push(chunk);
    } else {
      // The live stream only includes the non-parameter chunks
      onData(chunk);

      // Keep track of the latest IDR chunk, so we can start clients off with a near-current image
      if (chunkType === 5) {
        idrChunk(chunkWithSeparator);
      }
    }
  };

  * In the Websocket server we need to send the header and the last IDR chunk
  headers.forEach((frame) => ws.send(frame));   // Send the header
  ws.send(idrChunk);                            // Send the last idr chunk
*/
