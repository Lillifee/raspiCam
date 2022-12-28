import { booleanSetting, numberSetting } from './helper';
import { Setting } from './types';

/**
 * Stepper settings
 */
export const stepperSettingDesc = {
  /**
   * Axis enabled
   */
  enabled: booleanSetting('Enabled', false),

  /**
   * Step pin.
   */
  stepPin: numberSetting('Step pin', 0, 27, 0, 1),

  /**
   * Direction pin (1 CW, 0 CCW)
   */
  dirPin: numberSetting('Direction pin', 0, 27, 0, 1),

  /**
   * Enable pin (1 disabled, 0 enabled)
   */
  enaPin: numberSetting('Enable pin', 0, 27, 0, 1),

  /**
   * Max speed
   */
  maxSpeed: numberSetting('Max speed', 0, 2000, 600, 1),

  /**
   * Acceleration
   */
  acceleration: numberSetting('Acceleration', 0, 5000, 400, 1),
};

export type StepperSettingDesc = typeof stepperSettingDesc;
export type StepperSetting = Setting<StepperSettingDesc>;
