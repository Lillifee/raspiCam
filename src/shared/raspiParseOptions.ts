import {
  CameraOptions,
  PreviewOptions,
  RaspiStillOnlyOptions,
  RaspiStillOptions,
  RaspiVidOnlyOptions,
  RaspiVidOptions,
} from './raspiOptions';

interface BaseTypeOptions {
  name: string;
  description?: string;
}

interface StringTypeOption extends BaseTypeOptions {
  type: 'STRING';
  defaultValue: string;
  maxLength: number;
  convert: (value: string) => string;
}

interface NumberTypeOption extends BaseTypeOptions {
  type: 'NUMBER';
  defaultValue: number;
  minValue: number;
  maxValue: number;
  convert: (value: string) => number;
}

interface EnumTypeOption<T> extends BaseTypeOptions {
  type: 'ENUM';
  defaultValue: T;
  convert: (value: string) => T;
}

interface BooleanTypeOption extends BaseTypeOptions {
  type: 'BOOLEAN';
  defaultValue: boolean;
  convert: (value: string) => boolean;
}

export type ParseOptionGeneric<T> =
  | BooleanTypeOption
  | StringTypeOption
  | NumberTypeOption
  | EnumTypeOption<T>;

export type ParseOption = ParseOptionGeneric<never>;

export type ParseOptions<T> = {
  [K in keyof T]: ParseOptionGeneric<T[K]>;
};

const parseBool = (value: string) => value === 'true';

const parseEnum = <T extends string>(enums: T[], fallback: T) => (value: string): T => {
  const index = enums.findIndex((x) => x === value);
  return index >= 0 ? enums[index] : fallback;
};

const numberOption = (
  name: string,
  minValue: number,
  maxValue: number,
  defaultValue: number,
): NumberTypeOption => ({
  name,
  minValue,
  maxValue,
  defaultValue,
  type: 'NUMBER',
  convert: parseInt,
});

const booleanOption = (name: string, defaultValue = false): BooleanTypeOption => ({
  name,
  defaultValue,
  type: 'BOOLEAN',
  convert: parseBool,
});

const enumOption = <T extends string>(
  name: string,
  values: T[],
  defaultValue: T,
): EnumTypeOption<T> => ({
  name,
  defaultValue,
  type: 'ENUM',
  convert: parseEnum(values, defaultValue),
});

const stringOption = (name: string, defaultValue = '', maxLength = 50): StringTypeOption => ({
  name,
  maxLength,
  defaultValue,
  type: 'STRING',
  convert: (x) => x,
});

const cameraParseOptions: Partial<ParseOptions<CameraOptions>> = {
  sharpness: numberOption('sharpness', -100, 100, 0),
  contrast: numberOption('contrast', -100, 100, 0),
  brightness: numberOption('brightness', 0, 100, 50),
  saturation: numberOption('saturation', -100, 100, 50),
  iso: numberOption('iso', 100, 800, 200),
  vstab: booleanOption('video stabilisation'),
  ev: numberOption('EV compensation', -10, 10, 0),
  exposure: enumOption(
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

const previewOptions: ParseOptions<PreviewOptions> = {
  preview: stringOption('preview'),
  fullscreen: booleanOption('fullscreen', false),
  nopreview: booleanOption('no preview', true),
  opacity: numberOption('opacity', 0, 255, 255),
};

const vidOnlyParseOptions: Partial<ParseOptions<RaspiVidOnlyOptions>> = {
  width: numberOption('width', 64, 1920, 1280),
  height: numberOption('height', 64, 1080, 720),
  bitrate: numberOption('bitrate', 1000000, 25000000, 15000000),
};

const stillOnlyOptions: Partial<ParseOptions<RaspiStillOnlyOptions>> = {
  width: numberOption('width', 64, 4056, 4056),
  height: numberOption('height', 64, 3040, 3040),
  quality: numberOption('quality', 0, 100, 80),
};

export type RaspiStillParseOptions = ParseOptions<Partial<RaspiStillOptions>>;
export type RaspiVidParseOptions = ParseOptions<Partial<RaspiVidOptions>>;

export const raspiVidParseOptions: RaspiVidParseOptions = {
  ...vidOnlyParseOptions,
  ...cameraParseOptions,
  ...previewOptions,
};

export const raspiStillParseOptions: RaspiStillParseOptions = {
  ...stillOnlyOptions,
  ...cameraParseOptions,
  ...previewOptions,
};
