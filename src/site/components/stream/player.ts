import { PlayerStats, statsCalculator } from './stats';
import { streamFetch } from './streamFetch';
import { streamSplitter } from './streamHelper';
import { StreamDecoder } from './streamJMuxer';

export interface PlayerOptions {
  /**
   * Streaming URL
   */
  url: string;

  /**
   * Timeout before reconnect on connection lost. (default by 100ms)
   */
  reconnect?: number;

  /**
   * Drop frames for slow render devices or browser minimized.
   * Prevent the delay of a live stream by dropping frames,
   * if the render queue reach the frame limit (default by 10 frames)
   */
  dropFrames?: number;

  /**
   * Amount of statistic calculation per seconds
   * By default 5 calculations per second
   * 200ms to indicate if the stream is still running.
   */
  statsPerSecond?: number;

  /**
   * Use the web worker (default true)
   * Only apply for broadway player
   */
  useWorker?: boolean;

  /**
   * Use WebGL (default true)
   * Only used for broadway player
   */
  webgl?: boolean;

  /**
   * Callback for statistic updates
   */
  onStats?: (stats: PlayerStats) => void;
}

export interface Player {
  /**
   * Start the player
   */
  start: () => void;

  /**
   * Stop the player
   */
  stop: () => void;
}

/**
 * Create default Player options
 */
export const createPlayerOptions = (options: PlayerOptions): Required<PlayerOptions> => ({
  reconnect: 100,
  dropFrames: 10,
  statsPerSecond: 5,
  useWorker: true,
  webgl: true,
  onStats: () => undefined,
  ...options,
});

/**
 * Live H264 player
 *
 * @param playerOptions player options
 * @return Player
 */
export const player = (
  decoder: StreamDecoder,
  options: Required<PlayerOptions>,
  stats: PlayerStats,
): Player => {
  const splitter = streamSplitter(decoder.addFrame);
  const stream = streamFetch(splitter, options, stats);
  const calculator = statsCalculator(options, stats);

  const start = () => {
    console.log('Start Player');
    stream.start();
    calculator.start();
  };

  const stop = () => {
    stream.stop();
    calculator.stop();
  };

  start();

  return { start, stop };
};
