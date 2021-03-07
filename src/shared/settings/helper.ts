import {
  NumberTypeSetting,
  BooleanTypeSetting,
  EnumTypeSetting,
  GenericSettingDesc,
  Setting,
  StreamSettingDesc,
  PreviewSettingDesc,
  StillSettingDesc,
  VidSettingDesc,
} from '.';
import { isDefined } from '../helperFunctions';
import { CameraSettingDesc } from './types';

const defaultFormatValue = (value?: number | boolean | string) =>
  isDefined(value) ? `${value.toString()}` : '';

export const numberSetting = (
  name: string,
  minValue: number,
  maxValue: number,
  defaultValue: number | undefined,
  stepValue: number,
  format?: (value?: number) => string,
): NumberTypeSetting => ({
  type: 'NUMBER',
  name,
  minValue,
  maxValue,
  defaultValue,
  stepValue,
  format: format || defaultFormatValue,
  validate: (value) =>
    typeof value === 'number' && value >= minValue && value <= maxValue ? value : defaultValue,
});

export const booleanSetting = (name: string, defaultValue = false): BooleanTypeSetting => ({
  type: 'BOOLEAN',
  name,
  defaultValue,
  format: defaultFormatValue,
  validate: (value: unknown) => value === true,
});

export const enumSetting = (
  name: string,
  possibleValues: string[],
  defaultValue: string,
): EnumTypeSetting => ({
  type: 'ENUM',
  name,
  possibleValues,
  defaultValue,
  format: defaultFormatValue,
  validate: (value: unknown) => {
    const index = possibleValues.findIndex((x) => x === value);
    return index >= 0 ? possibleValues[index] : defaultValue;
  },
});

export const extractSettings = <T extends GenericSettingDesc>(settingDesc: T): Setting<T> =>
  Object.entries(settingDesc).reduce(
    (result, [key, desc]) => (isDefined(desc.value) ? { ...result, [key]: desc.value } : result),
    {} as Setting<T>,
  );

export const applySettings = <T extends GenericSettingDesc>(
  settingDesc: T,
  settings: Setting<T>,
): T =>
  Object.entries(settingDesc).reduce(
    (result, [key, desc]) => ({
      ...result,
      [key]: {
        ...desc,
        value: isDefined(settings[key]) ? desc.validate(settings[key]) : undefined,
      },
    }),
    {} as T,
  );

interface DefaultSettings {
  stream: Setting<StreamSettingDesc>;
  still: Setting<StillSettingDesc>;
  vid: Setting<VidSettingDesc>;
  camera: Setting<CameraSettingDesc>;
  preview: Setting<PreviewSettingDesc>;
}

export const baseSettings: DefaultSettings = {
  stream: {
    width: 1280,
    height: 720,
    framerate: 25,
    qp: 20,
  },
  still: {
    width: 4056,
    height: 3040,
    timeout: 1,
  },
  vid: {
    width: 1920,
    height: 1080,
    framerate: 30,
    timeout: 0,
  },
  camera: {},
  preview: {
    nopreview: true,
  },
};
