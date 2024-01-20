import { booleanSetting, enumSetting, numberSetting } from './helper';
import { Setting } from './types';

/**
 * Camera settings
 * https://www.raspberrypi.org/documentation/raspbian/applications/camera.md
 */
export const cameraSettingDesc = {
  /** Selects which camera to use on a multi-camera system. Use 0 or 1. */
  camera: enumSetting('Camera', ['0', '1'], '0'),

  /** Set the sensor mode */
  // TODO default value?
  // mode: enumSetting(
  //   'Sensor mode',
  //   ['4056:3040:12:P', '1632:1224:10', '2592:1944:10:U', '3264:2448'],
  //   'auto',
  // ),

  /** Set horizontal flip */
  hflip: booleanSetting('Horizontal flip', false),

  /** Set vertical flip */
  vflip: booleanSetting('Vertical flip', false),

  /** Set rotation  */
  rotation: numberSetting('Rotation', 0, 180, 0, 180),

  /** Set roi (region of interest)  */
  roi: enumSetting(
    'Region of interest',
    ['0,0,1,1', '0.25,0.25,0.5,0.5', '0.4,0.4,0.2,0.2', '0.45,0.45,0.1,0.1'],
    '0,0,1,1',
  ),

  /** Set HDR (High Dynamic Range) */
  hdr: booleanSetting('HDR', false),

  /** Set image sharpness (-100 - 100) */
  sharpness: numberSetting('Sharpness', -100, 100, 1, 1),

  /** Set image contrast (-100 - 100) */
  contrast: numberSetting('Contrast', 0, 2, 1, 0.01),

  /** Set image brightness (0 - 100) */
  brightness: numberSetting('Brightness', -1, 1, 0, 0.01),

  /** Set image saturation (-100 - 100) */
  saturation: numberSetting('Saturation', 0, 2, 1, 0.01),

  /** Set EV compensation (-10 - 10) */
  ev: numberSetting('EV compensation', -10, 10, 0, 0.1),

  /** Set shutter speed/time in microseconds */
  shutter: numberSetting('Shutter time', 0, 2500000, 0, 10000), // Default??

  /** Sets the combined analogue and digital gains */
  gain: numberSetting('Gain', 0, 100, 1, 0.1),

  /** Set metering mode */
  metering: enumSetting('Metering mode', ['centre', 'spot', 'average'], 'average'),

  /** Set exposure mode */
  exposure: enumSetting('Exposure mode', ['normal', 'sport', 'long'], 'normal'),

  /** Set Automatic White Balance (AWB) mode */
  awb: enumSetting(
    'AWB',
    [
      'manual',
      'auto',
      'incandescent',
      'tungsten',
      'fluorescent',
      'indoor',
      'daylight',
      'cloudy',
      'custom',
    ],
    'auto',
  ),

  /** Sets blue and red gains (as floating point numbers) to be applied when -awb off is set e.g. -awbg 1.5,1.2 */
  awbb: numberSetting('AWB blue', 0, 5, 1, 0.1),
  awbr: numberSetting('AWB red', 0, 5, 1, 0.1),

  /** Set the denoising mode */
  denoise: enumSetting('Denoise', ['auto', 'off', 'cdn_off ', 'cdn_fast', 'cdn_hq'], 'auto'),

  /** Specifies the autofocus mode */
  'autofocus-mode': enumSetting('Mode', ['default', 'manual', 'auto', 'continuous'], 'default'),

  /** Specifies the autofocus range */
  'autofocus-range': enumSetting('Range', ['normal', 'macro', 'full'], 'normal'),

  /** Specifies the autofocus speed */
  'autofocus-speed': enumSetting('Speed', ['normal', 'fast'], 'normal'),

  /** Specify the autofocus window */
  'autofocus-window': enumSetting('Window', ['0,0,1,1', '0.25,0.25,0.5,0.5'], '0,0,1,1'),

  /** Specify the lens position */
  'lens-position': numberSetting('Lens position', 0, 20, 1, 0.1),
};

export type CameraSettingDesc = typeof cameraSettingDesc;
export type CameraSetting = Setting<CameraSettingDesc>;

export const cameraSettingConverter = (
  settings: Setting<CameraSettingDesc>,
): Record<string, unknown> => {
  const { awbb, awbr, ...passThroughSettings } = settings;

  const awb = passThroughSettings.awb === 'manual' ? undefined : passThroughSettings.awb;
  const awbgains =
    passThroughSettings.awb === 'manual' ? `${awbr || '1'},${awbb || '1'}` : undefined;

  return { ...passThroughSettings, awb, awbgains };
};
