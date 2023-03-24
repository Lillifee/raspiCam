import { booleanSetting, stringSetting } from './helper';
import { Setting } from './types';

/**
 * timelapse settings
 */
export const timelapseSettingDesc = {
  /** Enable the cron schedule */
  enabled: booleanSetting('Enabled', false),

  /** Capture schedule in cron format */
  schedule: stringSetting('Schedule', '* * * * *', (input: unknown) =>
    typeof input === 'string' && input.match(/(((\d+,)+\d+|(\d+(\/|-)\d+)|\d+|\*) ?){5,7}/g)
      ? input
      : '* * * * *',
  ),
};

export type TimelapseSettingDesc = typeof timelapseSettingDesc;
export type TimelapseSetting = Setting<TimelapseSettingDesc>;
