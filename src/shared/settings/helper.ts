import { isDefined } from '../helperFunctions.js';
import {
  BooleanTypeSetting,
  EnumTypeSetting,
  GenericSettingDesc,
  NumberTypeSetting,
  Setting,
} from './types.js';

const defaultFormatValue = (value?: number | boolean | string) =>
  isDefined(value) ? `${value.toString()}` : '';

export const numberSetting = (
  name: string,
  minValue: number,
  maxValue: number,
  defaultValue: number,
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

export const enumSetting = <T extends string>(
  name: string,
  possibleValues: T[],
  defaultValue: T,
): EnumTypeSetting<T> => ({
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
