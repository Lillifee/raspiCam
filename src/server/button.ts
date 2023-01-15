import { Gpio } from 'onoff';
import { RaspiControl } from './control.js';
import { createLogger } from './logger.js';
import { SettingsHelper } from './settings.js';

const logger = createLogger('button');

export const createButtonControl = (raspiControl: RaspiControl, settingsHelper: SettingsHelper) => {
  let button: Gpio | undefined;

  const watchButton = () => {
    unwatchButton();

    const settings = settingsHelper.button.convert();
    if (!settings.gpioPin || settings.gpioPin === 'none') {
      return;
    }

    logger.info('setup gpio pin', settings.gpioPin);
    button = new Gpio(parseInt(settings.gpioPin), 'in', settings.edge, {
      debounceTimeout: settings.debounceTimeout,
    });

    button.watch((error, value) => {
      logger.info('button control', error || value);
      raspiControl.getStatus().running ? raspiControl.stop() : raspiControl.start();
    });
  };

  const unwatchButton = () => button?.unexport();
  const applySettings = () => watchButton();

  watchButton();

  ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) =>
    process.on(signal, () => {
      unwatchButton();
      process.exit();
    }),
  );

  return { applySettings };
};

export type ButtonControl = ReturnType<typeof createButtonControl>;
