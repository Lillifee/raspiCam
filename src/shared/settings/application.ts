import { enumSetting } from './helper';
import { Setting } from './types';

/**
 * Application settings
 */
export const applicationSettingDesc = {
  /** Defines the application theme */
  theme: enumSetting('Theme', ['Dark', 'Light'], 'Dark'),
};

export type ApplicationSettingDesc = typeof applicationSettingDesc;
export type ApplicationSetting = Setting<ApplicationSettingDesc>;
