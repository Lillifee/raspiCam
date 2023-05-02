import { appendUnit, multiplyAndAbbreviateNumber } from '../helperFunctions';
import { booleanSetting, enumSetting, numberSetting } from './helper';
import { Setting } from './types';

/**
 * Control settings
 */
export const buttonSettingDesc = {
  /** GPIO pin to capture an image/video */
  gpioPin: enumSetting(
    'Capture GPIO pin',
    [
      'none',
      '2',
      '3',
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
      '11',
      '12',
      '13',
      '14',
      '15',
      '16',
      '17',
      '18',
      '19',
      '20',
      '21',
      '22',
      '23',
      '24',
      '25',
      '26',
      '27',
    ],
    'none',
  ),

  /** Trigger Edge */
  edge: enumSetting('Edge', ['both', 'rising', 'falling'], 'rising'),

  /** Debounce timeout */
  debounceTimeout: numberSetting('Debounce timeout', 0, 1000, 10, 10, appendUnit('ms')),

  /** Lock-out time */
  lockoutTime: numberSetting(
    'Lock-out time',
    0,
    600000,
    0,
    1000,
    multiplyAndAbbreviateNumber('s', 0, 0.001),
  ),

  /** Stop capture on GPIO trigger */
  stopCaptureOnTrigger: booleanSetting('Stop capture on GPIO Trigger'),
};

export type ButtonSettingDesc = typeof buttonSettingDesc;
export type ButtonSetting = Setting<ButtonSettingDesc>;
