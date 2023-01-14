import { booleanSetting, enumSetting } from './helper.js';
import { Setting } from './types.js';

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
