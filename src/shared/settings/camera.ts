import { isDefined } from '../helperFunctions';
import { numberSetting, enumSetting, booleanSetting } from './helper';
import { CameraSettingDesc, Setting } from './types';

/**
 * Camera settings
 * https://www.raspberrypi.org/documentation/raspbian/applications/camera.md
 */
export const cameraSettingDesc = {
  /** Set image sharpness (-100 - 100) */
  sharpness: numberSetting('Sharpness', -100, 100, 0, 1),

  /** Set image contrast (-100 - 100) */
  contrast: numberSetting('Contrast', -100, 100, 0, 1),

  /** Set image brightness (0 - 100) */
  brightness: numberSetting('Brightness', 0, 100, 50, 1),

  /** Set image saturation (-100 - 100) */
  saturation: numberSetting('Saturation', -100, 100, 0, 1),

  /** Set capture ISO (100 - 800) */
  ISO: numberSetting('ISO', 100, 800, 200, 100),

  /** Set exposure mode */
  exposure: enumSetting(
    'Exposure mode',
    [
      'auto',
      'fixedfps',
      'verylong',
      'beach',
      'snow',
      'backlight',
      'spotlight',
      'sports',
      'antishake',
      'night',
      'nightpreview',
      'fireworks',
    ],
    'auto',
  ),

  /** Set EV compensation (-10 - 10) */
  ev: numberSetting('EV compensation', -10, 10, 0, 1),

  /** Set Automatic White Balance (AWB) mode */
  awb: enumSetting(
    'AWB',
    [
      'off',
      'auto',
      'sun',
      'cloud',
      'shade',
      'tungsten',
      'fluorescent',
      'incandescent',
      'flash',
      'horizon',
      'greyworld',
    ],
    'auto',
  ),

  /** Sets blue and red gains (as floating point numbers) to be applied when -awb off is set e.g. -awbg 1.5,1.2 */
  awbb: numberSetting('AWB blue', 0, 5, 1, 0.1),
  awbr: numberSetting('AWB red', 0, 5, 1, 0.1),

  /** Set image effect*/
  imxfx: enumSetting(
    'Image effect',
    [
      'none',
      'negative',
      'solarise',
      'posterise',
      'whiteboard',
      'blackboard',
      'sketch',
      'denoise',
      'emboss',
      'oilpaint',
      'hatch',
      'gpen',
      'pastel',
      'watercolour',
      'film',
      'blur',
      'saturation',
      'colourswap',
      'washedout',
      'colourpoint',
      'colourbalance',
      'cartoon',
    ],
    'none',
  ),

  /*
   * Set colour effect <U:V> e.g. 128:128
   * The supplied U and V parameters (range 0 - 255) are applied to the U and Y channels of the image.
   * For example, --colfx 128:128 should result in a monochrome image.
   */
  colfxEnabled: booleanSetting('Color effect', false),
  colfxu: numberSetting('U channel - blue', 0, 255, 128, 1),
  colfxv: numberSetting('V channel - red', 0, 255, 128, 1),

  /** Set metering mode */
  metering: enumSetting('Metering mode', ['average', 'spot', 'backlit', 'matrix'], 'average'),

  /** Enable/disable dynamic range compression */
  drc: enumSetting('Dynamic range compression', ['off', 'low', 'med', 'high'], 'off'),

  /** Set shutter speed/time in microseconds */
  shutter: numberSetting('Shutter time', 0, 2500000, 0, 10000), // Default??

  /** Sets the analog gain value directly on the sensor  */
  analoggain: numberSetting('Analog gain', 0, 12, 0, 0.1),

  /** Sets the digital gain value applied by the ISP 1.0 to 64.0 (over about 4.0 will produce overexposed images) */
  digitalgain: numberSetting('Digital gain', 0, 4, 1, 0.1),

  /** Set flicker avoidance mode */
  flicker: enumSetting('Flicker', ['off', 'auto', '50hz', '60hz'], 'auto'),

  /** Set the video stabilisation mode */
  vstab: booleanSetting('Video stabilisation'),

  /** Set horizontal flip */
  hflip: booleanSetting('Horizontal flip', false),

  /** Set vertical flip */
  vflip: booleanSetting('Vertical flip', false),

  /** Sets a specified sensor mode  */
  mode: numberSetting('Sensor mode', 0, 7, 0, 1),

  /** Selects which camera to use on a multi-camera system. Use 0 or 1. */
  camselect: enumSetting('Camera', ['0', '1'], '0'),

  // TODO not supported properties

  /** Set sensor region of interest e.g. 0.5,0.5,0.25,0.25  */
  // roi: string;

  /** Use stills capture frame for image statistics */
  // stats: boolean;
};

export const cameraSettingConverter = (
  settings: Setting<CameraSettingDesc>,
): Record<string, unknown> => {
  const { awbb, awbr, colfxEnabled, colfxu, colfxv, ...passThroughSettings } = settings;

  const awbgains = passThroughSettings.awb === 'off' ? `${awbr || '1'},${awbb || '1'}` : undefined;
  const colfx = colfxEnabled
    ? `${isDefined(colfxu) ? colfxu : '128'}:${isDefined(colfxv) ? colfxv : '128'}`
    : undefined;

  return { ...passThroughSettings, awbgains, colfx };
};
