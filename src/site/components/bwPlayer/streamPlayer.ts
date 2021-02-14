import { PlayerOptions, PlayerStats } from '.';
import { parseFragmentType } from './streamHelper';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Player = require('../../../../broadway/Player');

export interface StreamPlayer {
  canvas: HTMLCanvasElement;
  addFrame: (frame: Uint8Array) => void;
}

/**
 * Broadway player
 *
 * @param options player options
 * @param stats player statistics
 */
export const streamPlayer = (
  options: Required<PlayerOptions>,
  stats: PlayerStats,
): StreamPlayer => {
  const { useWorker, webgl, size } = options;
  const player = new Player({ useWorker, webgl, size });
  const frames: Uint8Array[] = [];

  const decodeFrame = (): void => {
    const frame = frames.shift();

    if (frame) {
      // Skip frames until next useful fragment type to reduce artifacts
      if (stats.droppingFrames && parseFragmentType(frame)) {
        stats.droppingFrames = false;
      }

      // Decode the frame
      if (!stats.droppingFrames) {
        player.decode(frame);
      }
    }

    // Decode the next frame as soon as possible
    requestAnimationFrame(decodeFrame);
  };

  player.onPictureDecoded = (_: Buffer, width: number, height: number) => {
    // Add statistic informations
    stats.playerResolution.width = width;
    stats.playerResolution.height = height;
    stats.framesPerCycle++;
  };

  const addFrame = (frame: Uint8Array) => {
    // Drop frames if too many frames in the queue (e.g. minimize browser)
    if (frames.length < options.dropFrames) {
      frames.push(frame);
    } else {
      stats.totalDroppedFrames++;
      stats.droppingFrames = true;
    }
  };

  decodeFrame();
  return { addFrame, canvas: player.canvas };
};
