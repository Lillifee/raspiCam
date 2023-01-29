import type { Gpio } from 'onoff';
import { RaspiControl } from './control';
import { createLogger } from './logger';
import { SettingsHelper } from './settings';

const logger = createLogger('button');

export interface ButtonControl {
  available: boolean;
  applySettings: () => void;
}

export const createButtonControl = async (
  raspiControl: RaspiControl,
  settingsHelper: SettingsHelper,
): Promise<ButtonControl> =>
  import('onoff')
    .then((onoff) => {
      let button: Gpio | undefined;

      const watchButton = () => {
        unwatchButton();

        const settings = settingsHelper.button.convert();
        if (!settings.gpioPin || settings.gpioPin === 'none') {
          return;
        }

        logger.info('setup gpio pin', settings.gpioPin);
        button = new onoff.Gpio(parseInt(settings.gpioPin), 'in', settings.edge, {
          debounceTimeout: settings.debounceTimeout,
        });

        button.watch((error, value) => {
          logger.info('button control', error || value);
          raspiControl.getStatus().running ? raspiControl.stop() : raspiControl.start();
        });
      };

      const unwatchButton = () => {
        button?.unexport();
        button = undefined;
      };
      const applySettings = () => watchButton();

      watchButton();

      ['SIGINT', 'SIGTERM', 'SIGQUIT'].forEach((signal) =>
        process.on(signal, () => {
          unwatchButton();
          process.exit();
        }),
      );

      return { available: true, applySettings };
    })
    .catch((error) => {
      logger.warning(
        "onoff library not found...\nTo enable GPIO support please install the onoff library and restart raspiCam. 'npm install onoff'\n",
        error,
      );
      return {
        available: false,
        applySettings: () => undefined,
      };
    });
