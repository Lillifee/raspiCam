import { booleanSetting, enumSetting } from './helper';
import { Setting } from './types';

/**
 * Control settings
 */
export const controlSettingDesc = {
  /** Capture mode */
  mode: enumSetting('Mode', ['Photo', 'Video'], 'Photo'),

  /** Capture on startup */
  captureStartup: booleanSetting('Capture on startup', false),
};

export type ControlSettingDesc = typeof controlSettingDesc;
export type ControlSetting = Setting<ControlSettingDesc>;
