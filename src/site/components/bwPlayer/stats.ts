import { PlayerOptions, PlayerStats } from '.';

/**
 * Average calculator per seconds.
 * Stats per second defines how many times the calculator gets called.
 * The duration defines the amount of time (samples) of the avg calculation.
 *
 * @param {number} statsPerSecond Amount of calls within one second
 * @param {number} duration Average calculation base duration
 */
const avgCalculator = (statsPerSecond: number, duration: number) => {
  const buffer: number[] = [];
  const bufferLength = statsPerSecond * duration;
  let sum = 0;

  return (current: number) => {
    buffer.push(current);
    sum += current;
    sum -= buffer.length > bufferLength ? buffer.shift() || 0 : 0;
    return Math.floor(sum / duration);
  };
};

/**
 * Caluclate the player statistics
 *
 * @param {Required<PlayerOptions>} options
 * @param {PlayerStats} stats
 */
export const statsCalculator = (
  options: Required<PlayerOptions>,
  stats: PlayerStats,
): { start: () => void; stop: () => void } => {
  const fpsCalcAvg = avgCalculator(options.statsPerSecond, 3);
  const fpsCalc = avgCalculator(options.statsPerSecond, 1);
  const sizeCalcAvg = avgCalculator(options.statsPerSecond, 5);

  let timer: ReturnType<typeof setInterval>;

  const calculate = () => {
    const avgFps = fpsCalcAvg(stats.framesPerCycle);
    const avgSize = sizeCalcAvg(stats.sizePerCycle);
    const playerRunning = fpsCalc(stats.framesPerCycle) > 0;

    const newStats = { ...stats, avgFps, avgSize, playerRunning };
    options.onStats(newStats);

    stats.framesPerCycle = 0;
    stats.sizePerCycle = 0;
  };

  const start = () => (timer = setInterval(calculate, 1000 / options.statsPerSecond));
  const stop = () => clearInterval(timer);

  return { start, stop };
};
