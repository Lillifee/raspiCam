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

const defaultFormatValue = (value: number | boolean) => `${value.toString()}`;

export const numberSetting = (
  name: string,
  minValue: number,
  maxValue: number,
  defaultValue: number,
  stepValue: number,
  format?: (value: number) => string,
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
  format: (value: string) => value,
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
      [key]: { ...desc, value: desc.validate(settings[key]) },
    }),
    {} as T,
  );

const defaultStreamSettings: Setting<StreamSettingDesc> = {
  width: 1280,
  height: 720,
  framerate: 25,
  qp: 20,
};
const defaultStillSettings: Setting<StillSettingDesc> = {
  width: 4056,
  height: 3040,
  timeout: 1,
};

const defaultPreviewSettings: Setting<PreviewSettingDesc> = {
  nopreview: true,
};

const defaultVidSettings: Setting<VidSettingDesc> = {
  width: 1920,
  height: 1080,
  timeout: 0,
  framerate: 30,
  profile: 'baseline',
  inline: true,
};

export const defaultSettings = {
  stream: defaultStreamSettings,
  still: defaultStillSettings,
  vid: defaultVidSettings,
  camera: {},
  preview: defaultPreviewSettings,
};
