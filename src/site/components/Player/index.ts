import { statsCalculator } from './stats';
import { streamFetch } from './streamFetch';
import { streamSplitter } from './streamHelper';
import { streamPlayer } from './streamPlayer';

export interface PlayerSize {
  width: number;
  height: number;
}

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
   * Callback for statistic updates
   */
  onStats?: (stats: PlayerStats) => void;
}

/**
 * Player stats are calculations triggered by an interval,
 * defined in the @PlayerOptions by @statsPerSecond
 */
export interface PlayerStats {
  /**
   * Frames during the last cycle
   */
  framesPerCycle: number;

  /**
   * Stream size during the last cycle
   */
  sizePerCycle: number;

  /**
   * Average frames per seconds over the last 3 seconds
   */
  avgFps: number;

  /**
   * Average stream size over the last 3 seconds in byte
   * Rounded to 100kB
   */
  avgSize: number;

  /**
   * Player running indication
   * If no more frames rendered within the last 200ms.
   */
  playerRunning: boolean;

  /**
   * Stream running indication
   */
  streamRunning: boolean;

  /**
   * dropping frames during the last cycle indication
   */
  droppingFrames: boolean;

  /**
   * Total dropped frames since player start
   */
  totalDroppedFrames: number;
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
  onStats: () => undefined,
  ...options,
});

/**
 * Create initial player statistics
 */
export const createPlayerStats = (): PlayerStats => ({
  framesPerCycle: 0,
  sizePerCycle: 0,
  avgFps: 0,
  avgSize: 0,
  playerRunning: false,
  droppingFrames: false,
  streamRunning: false,
  totalDroppedFrames: 0,
});

/**
 * Live H264 player
 *
 * @param playerOptions player options
 * @return Player
 */
export const player = (playerOptions: PlayerOptions): Player => {
  const options = createPlayerOptions(playerOptions);
  const stats = createPlayerStats();

  const player = streamPlayer(options, stats);
  const splitter = streamSplitter(player.addFrame);
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
