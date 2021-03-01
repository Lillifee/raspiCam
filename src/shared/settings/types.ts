import {
  cameraSettingDesc,
  previewSettingDesc,
  stillSettingDesc,
  streamSettingDesc,
  vidSettingDesc,
} from '.';

interface BaseTypeSetting<T> {
  name: string;
  value?: T;
  description?: string;
  format: (value: T) => string;
  validate: (value: unknown) => T | undefined;
}

export interface NumberTypeSetting extends BaseTypeSetting<number> {
  type: 'NUMBER';
  defaultValue: number;
  minValue: number;
  maxValue: number;
  stepValue: number;
}

export interface EnumTypeSetting extends BaseTypeSetting<string> {
  type: 'ENUM';
  defaultValue: string;
  possibleValues: string[];
}

export interface BooleanTypeSetting extends BaseTypeSetting<boolean> {
  type: 'BOOLEAN';
  defaultValue: boolean;
}

export type TypeSetting = BooleanTypeSetting | NumberTypeSetting | EnumTypeSetting;
export type GenericSettingDesc = Record<string, TypeSetting>;
export type Setting<T extends { [k in keyof T]: TypeSetting }> = { [K in keyof T]?: T[K]['value'] };

export type StreamSettingDesc = typeof streamSettingDesc;
export type StillSettingDesc = typeof stillSettingDesc;
export type VidSettingDesc = typeof vidSettingDesc;
export type CameraSettingDesc = typeof cameraSettingDesc;
export type PreviewSettingDesc = typeof previewSettingDesc;

export type SettingDesc =
  | CameraSettingDesc
  | PreviewSettingDesc
  | StillSettingDesc
  | StreamSettingDesc
  | VidSettingDesc;
