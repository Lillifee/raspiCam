interface BaseTypeSetting<T> {
  name: string;
  value?: T;
  description?: string;
  defaultValue: T | undefined;
  format: (value: T | undefined) => string;
  validate: (value: unknown) => T | undefined;
}

export interface NumberTypeSetting extends BaseTypeSetting<number> {
  type: 'NUMBER';
  minValue: number;
  maxValue: number;
  stepValue: number;
}

export interface EnumTypeSetting extends BaseTypeSetting<string> {
  type: 'ENUM';
  possibleValues: string[];
}

export interface BooleanTypeSetting extends BaseTypeSetting<boolean> {
  type: 'BOOLEAN';
}

export type TypeSetting = BooleanTypeSetting | NumberTypeSetting | EnumTypeSetting;
export type GenericSettingDesc = Record<string, TypeSetting>;
export type Setting<T extends { [k in keyof T]: TypeSetting }> = { [K in keyof T]?: T[K]['value'] };

export type RaspiMode = 'Photo' | 'Video' | 'Timelapse';
export const raspiModes: RaspiMode[] = ['Photo', 'Video', 'Timelapse'];

export interface RaspiControlStatus {
  mode: RaspiMode;
  running?: boolean;
  lastImagePath?: string;
  lastError?: string;
}
