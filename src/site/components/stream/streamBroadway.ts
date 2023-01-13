import { PlayerOptions } from './player';
import { PlayerStats } from './stats';
import { parseFragmentType } from './streamHelper';

// TODO Add typing for broadway player and enable eslint
// TODO Or refactor the player to a typescript file.
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
const Player = require('../../../../broadway/Player');

export interface BroadwayStreamDecoder {
  canvas: HTMLCanvasElement;
  addFrame: (frame: Uint8Array) => void;
}

/**
 * Broadway player
 *
 * @param options player options
 * @param stats player statistics
 */
export const streamBroadway = (
  options: Required<PlayerOptions>,
  stats: PlayerStats,
): BroadwayStreamDecoder => {
  const { useWorker, webgl } = options;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
  const player = new Player({ useWorker, webgl });

  const frames: Uint8Array[] = [];

  const addFrame = (frame: Uint8Array) => {
    // Drop frames if too many frames in the queue (e.g. minimize browser)
    if (frames.length < options.dropFrames) {
      frames.push(frame);
    } else {
      stats.totalDroppedFrames++;
      stats.droppingFrames = true;
    }
  };

  const decodeFrame = (): void => {
    const frame = frames.shift();

    if (frame) {
      // Skip frames until next useful fragment type to reduce artifacts
      if (stats.droppingFrames && parseFragmentType(frame)) {
        stats.droppingFrames = false;
      }

      // Decode the frame
      if (!stats.droppingFrames) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        player.decode(frame);
        stats.framesPerCycle++;
      }
    }

    // Decode the next frame as soon as possible
    requestAnimationFrame(decodeFrame);
  };

  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  player.onPictureDecoded = () => {
    // Add statistic information
    stats.framesPerCycle++;
  };

  decodeFrame();

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  return { addFrame, canvas: player.canvas };
};
