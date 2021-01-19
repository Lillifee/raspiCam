import { ChildProcess, spawn } from 'child_process';
import Split from 'stream-split';

const NALSeparator = Buffer.from([0, 0, 0, 1]);

export interface RaspiVidOptions {
  width: number;
  height: number;
  framerate: number;
  profile: 'baseline' | 'main' | 'high';
  timeout: number;
  bitrate?: number;
  verticalFlip?: boolean;
  horizontalFlip?: boolean;
}

export interface RaspiVid {
  start: () => void;
  stop: () => void;
}

/**
 * RaspiVid
 */
const raspivid = (options: RaspiVidOptions, onData: (data: Buffer) => void): RaspiVid => {
  let process: ChildProcess | undefined;

  /**
   * Start raspivid
   */
  const start = () => {
    console.info('raspivid - Start');
    const spawnArgs = Object.entries(options).reduce<string[]>((result, [key, value]) => {
      result.push(`--${key}`);
      result.push(value);
      return result;
    }, []);

    // Spawn the raspivid with -ih (Insert PPS, SPS headers) - see end of the file
    process = spawn('raspivid', ['--nopreview', ...spawnArgs, '-ih', '-o', '-'], {
      stdio: ['ignore', 'pipe', 'inherit'],
    }).on('error', (e) => {
      console.error('raspivid - error', e.message);
    });

    // TODO Check if we can forward the NAL splitter using pipe
    const NALSplitter = new Split(NALSeparator);
    NALSplitter.on('data', (data: Buffer) => onData(Buffer.concat([NALSeparator, data])));

    process?.stdout?.pipe(NALSplitter);
  };

  /**
   * Stop the TCP server
   */
  const stop = () => {
    if (process) {
      process.stdout?.pause();
      process.kill();
      process = undefined;
    }
  };

  start();
  return { start, stop };
};

export default raspivid;

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
