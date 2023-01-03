import chalk from 'chalk';

export const createLogger = (module: string) => ({
  log: (...text: unknown[]) => console.log(chalk.blackBright(`[${module}]`, ...text)),
  info: (...text: unknown[]) => console.log(chalk.blueBright(`[${module}]`, ...text)),
  success: (...text: unknown[]) => console.log(chalk.greenBright(`[${module}]`, ...text)),
  warning: (...text: unknown[]) => console.log(chalk.yellowBright(`[${module}]`, ...text)),
  error: (...text: unknown[]) => console.log(chalk.redBright(`[${module}]`, ...text)),
});
