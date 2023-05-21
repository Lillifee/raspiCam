import { CronJob } from 'cron';
import { isDefined } from '../shared/helperFunctions';
import { TimelapseState } from '../shared/settings/types';
import { RaspiControl } from './control';
import { createLogger } from './logger';
import { SettingsHelper } from './settings';

const logger = createLogger('timelapse');

export interface Timelapse {
  getState: () => TimelapseState;
  applySettings: () => void;
}

export const createTimelapse = (
  raspiControl: RaspiControl,
  settingsHelper: SettingsHelper,
): Timelapse => {
  let cronJob: CronJob | undefined;

  const applySettings = () => {
    const settings = settingsHelper.timelapse.convert();

    cronJob?.stop();

    if (settings.enabled && settings.schedule) {
      cronJob = new CronJob(settings.schedule, () => {
        logger.info('trigger cron job...');
        if (!raspiControl.getStatus().running) {
          raspiControl.start().catch(() => undefined);
        }
      });
      cronJob.start();
    }
  };

  const getState = () => {
    const cronNextDates = cronJob?.nextDates(4);
    const nextDatesArray = Array.isArray(cronNextDates) ? cronNextDates : [cronNextDates];

    const nextDate = cronJob?.nextDate().setLocale('en').toRelative() || undefined;
    const nextDates = nextDatesArray
      ?.map((x) => x?.setLocale('en').toFormat('f'))
      .filter(isDefined);

    return {
      running: !!cronJob?.running,
      nextDate: nextDate,
      nextDates: nextDates,
    };
  };

  applySettings();

  return {
    getState,
    applySettings,
  };
};
