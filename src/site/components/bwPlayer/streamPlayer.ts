import { PlayerOptions, PlayerStats } from '.';
import { parseFragmentType } from './streamHelper';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Player = require('../../../../broadway/Player');

export const streamPlayer = (
  options: Required<PlayerOptions>,
  stats: PlayerStats,
): { addFrame: (frame: Uint8Array) => void; canvas: HTMLCanvasElement } => {
  const { useWorker, webgl, size } = options;
  const player = new Player({ useWorker, webgl, size });
  const frames: Uint8Array[] = [];

  const decodeFrame = (): void => {
    const frame = frames.shift();

    if (frame) {
      const type = parseFragmentType(frame);
      if (type) console.log(type);

      if (stats.droppingFrames && type) {
        stats.droppingFrames = false;
      }
      if (!stats.droppingFrames) {
        player.decode(frame);
      }
    }
    requestAnimationFrame(decodeFrame);
  };

  player.onPictureDecoded = (_: Buffer, width: number, height: number) => {
    stats.playerResolution.width = width;
    stats.playerResolution.height = height;
    stats.framesPerCycle++;
  };

  const addFrame = (frame: Uint8Array) => {
    if (frames.length > options.dropFrames) {
      stats.totalDroppedFrames++;
      stats.droppingFrames = true;
    } else {
      frames.push(frame);
    }
  };

  decodeFrame();
  return { addFrame, canvas: player.canvas };
};
