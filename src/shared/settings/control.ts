import { booleanSetting, enumSetting } from './helper';
import { FileNameFormat, Setting } from './types';

/**
 * Control settings
 */
export const controlSettingDesc = {
  /** Capture mode */
  mode: enumSetting('Mode', ['Photo', 'Video'], 'Photo'),

  /** Capture on startup */
  captureStartup: booleanSetting('Capture on startup', false),

  /** File name format */
  fileName: enumSetting<FileNameFormat>(
    'File name',
    ['ISO Date time', 'Unix time', 'Date time'],
    'ISO Date time',
  ),

  /** Extract a thumbnail as preview */
  extractThumbnail: booleanSetting('Extract thumbnail', true),
};

export type ControlSettingDesc = typeof controlSettingDesc;
export type ControlSetting = Setting<ControlSettingDesc>;
