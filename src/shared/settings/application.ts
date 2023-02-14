import { booleanSetting, enumSetting } from './helper';
import { GridLineType, Setting } from './types';

/**
 * Application settings
 */
export const applicationSettingDesc = {
  /** Defines the application theme */
  theme: enumSetting('Theme', ['dark', 'light'], 'dark'),

  /** Defines the application theme */
  gridLines: enumSetting<GridLineType>(
    'Grid lines',
    ['none', '3x3', '4x4', 'golden ratio'],
    'none',
  ),

  /** Player for H264 stream  */
  player: enumSetting('Player', ['Broadway', 'JMuxer'], 'JMuxer'),

  /** Display the player statistics */
  playerStats: booleanSetting('Stream statistics', false),
};

export type ApplicationSettingDesc = typeof applicationSettingDesc;
export type ApplicationSetting = Setting<ApplicationSettingDesc>;
