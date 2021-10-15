import chalk from 'chalk';

export interface Logger {
  log: (...text: unknown[]) => void;
  info: (...text: unknown[]) => void;
  success: (...text: unknown[]) => void;
  warning: (...text: unknown[]) => void;
  error: (...text: unknown[]) => void;
}

export const createLogger = (module: string): Logger => {
  const log =
    (fn: chalk.ChalkFunction) =>
    (...text: unknown[]) =>
      console.log(fn(`[${module}]`, ...text));

  return {
    log: log(chalk.blackBright),
    info: log(chalk.blueBright),
    success: log(chalk.greenBright),
    warning: log(chalk.yellowBright),
    error: log(chalk.redBright),
  };
};
