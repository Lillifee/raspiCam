import {
  RaspiCameraSettings,
  RaspiPreviewSettings,
  RaspiVidSettings,
  RaspiStillSettings,
} from './raspiSettings';

interface BaseTypeSetting {
  name: string;
  description?: string;
}

export interface StringTypeSetting extends BaseTypeSetting {
  type: 'STRING';
  defaultValue: string;
  maxLength: number;
  convert: (value: string) => string;
}

export interface NumberTypeSetting extends BaseTypeSetting {
  type: 'NUMBER';
  defaultValue: number;
  minValue: number;
  maxValue: number;
  convert: (value: string) => number;
}

export interface EnumTypeSetting extends BaseTypeSetting {
  type: 'ENUM';
  defaultValue: string;
  possibleValues: string[];
  convert: (value: string) => string;
}

export interface BooleanTypeSetting extends BaseTypeSetting {
  type: 'BOOLEAN';
  defaultValue: boolean;
  convert: (value: string) => boolean;
}

export type ParseSetting =
  | BooleanTypeSetting
  | StringTypeSetting
  | NumberTypeSetting
  | EnumTypeSetting;

export type ParseSettings<T> = {
  [K in keyof T]: ParseSetting;
};

export type ParseSettingTypes = ParseSetting['type'];

const parseBool = (value: string) => value === 'true';

const parseEnum = <T extends string>(enums: T[], fallback: T) => (value: string): T => {
  const index = enums.findIndex((x) => x === value);
  return index >= 0 ? enums[index] : fallback;
};

const numberSetting = (
  name: string,
  minValue: number,
  maxValue: number,
  defaultValue: number,
): NumberTypeSetting => ({
  name,
  minValue,
  maxValue,
  defaultValue,
  type: 'NUMBER',
  convert: parseInt,
});

const booleanSetting = (name: string, defaultValue = false): BooleanTypeSetting => ({
  name,
  defaultValue,
  type: 'BOOLEAN',
  convert: parseBool,
});

const enumSetting = (
  name: string,
  possibleValues: string[],
  defaultValue: string,
): EnumTypeSetting => ({
  name,
  possibleValues,
  defaultValue,
  type: 'ENUM',
  convert: parseEnum(possibleValues, defaultValue),
});

const stringSetting = (name: string, defaultValue = '', maxLength = 50): StringTypeSetting => ({
  name,
  maxLength,
  defaultValue,
  type: 'STRING',
  convert: (x) => x,
});

export type RaspiCameraParseSettings = Partial<ParseSettings<RaspiCameraSettings>>;
export type RaspiPreviewParseSettings = Partial<ParseSettings<RaspiPreviewSettings>>;
export type RaspiVidParseSettings = Partial<ParseSettings<RaspiVidSettings>>;
export type RaspiStillParseSettings = Partial<ParseSettings<RaspiStillSettings>>;

export const raspiCameraParseSettings: RaspiCameraParseSettings = {
  sharpness: numberSetting('Sharpness', -100, 100, 0),
  contrast: numberSetting('Contrast', -100, 100, 0),
  brightness: numberSetting('Brightness', 0, 100, 50),
  saturation: numberSetting('Saturation', -100, 100, 0),
  ISO: numberSetting('ISO', 100, 800, 200),
  vstab: booleanSetting('Video stabilisation'),
  ev: numberSetting('EV compensation', -10, 10, 0),
  exposure: enumSetting(
    'Exposure mode',
    [
      'auto',
      'night',
      'nightpreview',
      'backlight',
      'spotlight',
      'sports',
      'snow',
      'beach',
      'verylong',
      'fixedfps',
      'antishake',
      'fireworks',
    ],
    'auto',
  ),
  flicker: enumSetting('Flicker', ['off', 'auto', '50hz', '60hz'], 'auto'),
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

  // /** Set colour effect <U:V> e.g. 128:128 */
  // colfx: string;

  metering: enumSetting('Metering mode', ['average', 'spot', 'backlit', 'matrix'], 'average'),
  hflip: booleanSetting('Horizontal flip', false),
  vflip: booleanSetting('Vertical flip', false),

  // /** Set sensor region of interest e.g. 0.5,0.5,0.25,0.25  */
  // roi: string;

  shutter: numberSetting('shutter', 0, 200000000, 1), // Default??

  drc: enumSetting('Dynamic range compression', ['off', 'low', 'med', 'high'], 'off'),

  // /** Use stills capture frame for image statistics */
  // stats: boolean;

  // /** Sets blue and red gains (as floating point numbers) to be applied when -awb off is set e.g. -awbg 1.5,1.2 */
  // awbgains: string;

  analoggain: numberSetting('Analog gain', 1, 12, 1),
  digitalgain: numberSetting('Digital gain', 1, 64, 1),

  mode: numberSetting('Sensor mode', 0, 4, 0),
  // /** Sets a specified sensor mode  */
  // mode:
  //   | '0' // automatic selection
  //   | '1' // 2028x1080	169:90	0.1-50fps	Partial	2x2 binned
  //   | '2' // 2028x1520	4:3	0.1-50fps	Full	2x2 binned
  //   | '3' // 4056x3040	4:3	0.005-10fps	Full	None
  //   | '4'; // 1332x990	74:55	50.1-120fps	Partial	2x2 binned

  camselect: enumSetting('Camera', ['0', '1'], '0'),
};

export const raspiPreviewParseSettings: RaspiPreviewParseSettings = {
  preview: stringSetting('preview'),
  fullscreen: booleanSetting('fullscreen', false),
  nopreview: booleanSetting('no preview', true),
  opacity: numberSetting('opacity', 0, 255, 255),
};

export const raspiVidParseSettings: RaspiVidParseSettings = {
  width: numberSetting('Width', 64, 1920, 1280),
  height: numberSetting('Height', 64, 1080, 720),
  bitrate: numberSetting('Bitrate', 1000000, 25000000, 15000000),
};

export const raspiStillParseSettings: RaspiStillParseSettings = {
  width: numberSetting('Width', 64, 4056, 4056),
  height: numberSetting('Height', 64, 3040, 3040),
  quality: numberSetting('Quality', 0, 100, 80),
};

// export type RaspiStillParseSettings = ParseSettings<Partial<RaspiStillSettings>>;
// export type RaspiVidParseSettings = ParseSettings<Partial<RaspiVidSettings>>;

// export const raspiVidParseSettings: RaspiVidParseSettings = {
//   ...vidOnlyParseSettings,
//   ...cameraParseSettings,
//   ...previewSettings,
// };

// export const raspiStillParseSettings: RaspiStillParseSettings = {
//   ...stillOnlySettings,
//   ...cameraParseSettings,
//   ...previewSettings,
// };
