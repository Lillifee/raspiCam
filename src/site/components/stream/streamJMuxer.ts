import JMuxer from 'jmuxer';
import { PlayerOptions } from './player';
import { PlayerStats } from './stats';
import { parseFragmentType } from './streamHelper';

export interface StreamDecoder {
  addFrame: (frame: Uint8Array) => void;
}

/**
 * JMuxer decoder
 *
 * @param options player options
 * @param stats player statistics
 */
export const streamJMuxer = (
  options: Required<PlayerOptions>,
  stats: PlayerStats,
): StreamDecoder => {
  const jmuxer = new JMuxer({
    node: 'player',
    mode: 'video',
    flushingTime: 0,
  });

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
        jmuxer.feed({ video: frame });
        stats.framesPerCycle++;
      }
    }

    // Decode the next frame as soon as possible
    requestAnimationFrame(decodeFrame);
  };

  decodeFrame();

  return { addFrame };
};
