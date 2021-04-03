import JMuxer from 'jmuxer';
import { PlayerOptions, PlayerStats } from '.';
import { parseFragmentType } from './streamHelper';

export interface StreamPlayer {
  addFrame: (frame: Uint8Array) => void;
}

/**
 * JMuxer player
 *
 * @param options player options
 * @param stats player statistics
 */
export const streamPlayer = (
  options: Required<PlayerOptions>,
  stats: PlayerStats,
): StreamPlayer => {
  const jmuxer = new JMuxer({
    node: 'player',
    mode: 'video',
    flushingTime: 0,
  });

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
        jmuxer.feed({ video: frame });
        stats.framesPerCycle++;
      }
    }

    // Decode the next frame as soon as possible
    requestAnimationFrame(decodeFrame);
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
  return { addFrame };
};
