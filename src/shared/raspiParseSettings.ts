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
  sharpness: numberSetting('sharpness', -100, 100, 0),
  contrast: numberSetting('contrast', -100, 100, 0),
  brightness: numberSetting('brightness', 0, 100, 50),
  saturation: numberSetting('saturation', -100, 100, 0),
  ISO: numberSetting('ISO', 100, 800, 200),
  vstab: booleanSetting('video stabilisation'),
  ev: numberSetting('EV compensation', -10, 10, 0),
  exposure: enumSetting(
    'exposure mode',
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
};

export const raspiPreviewParseSettings: RaspiPreviewParseSettings = {
  preview: stringSetting('preview'),
  fullscreen: booleanSetting('fullscreen', false),
  nopreview: booleanSetting('no preview', true),
  opacity: numberSetting('opacity', 0, 255, 255),
};

export const raspiVidParseSettings: RaspiVidParseSettings = {
  width: numberSetting('width', 64, 1920, 1280),
  height: numberSetting('height', 64, 1080, 720),
  bitrate: numberSetting('bitrate', 1000000, 25000000, 15000000),
};

export const raspiStillParseSettings: RaspiStillParseSettings = {
  width: numberSetting('width', 64, 4056, 4056),
  height: numberSetting('height', 64, 3040, 3040),
  quality: numberSetting('quality', 0, 100, 80),
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
