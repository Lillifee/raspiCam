export interface BaseTypeSetting<T = unknown> {
  name: string;
  description?: string;
  defaultValue: T | undefined;
  value?: T;
  validate: (value: unknown) => T | undefined;
}

// TODO Try to move format to BaseTypeSetting
interface FormattableBaseTypeSetting<T> extends BaseTypeSetting<T> {
  format: (value?: T) => string;
}

export interface NumberTypeSetting extends FormattableBaseTypeSetting<number> {
  type: 'NUMBER';
  minValue: number;
  maxValue: number;
  stepValue: number;
}

export interface EnumTypeSetting<T> extends FormattableBaseTypeSetting<T> {
  type: 'ENUM';
  possibleValues: T[];
}

export interface BooleanTypeSetting extends FormattableBaseTypeSetting<boolean> {
  type: 'BOOLEAN';
}

export interface StringTypeSetting extends FormattableBaseTypeSetting<string> {
  type: 'STRING';
}

export type GenericSettingDesc = Record<string, BaseTypeSetting>;
export type Setting<T extends { [k in keyof T]: BaseTypeSetting }> = {
  [K in keyof T]?: T[K]['value'];
};

export type RaspiMode = 'Photo' | 'Video';
export type GridLineType = 'none' | '3x3' | '4x4' | 'golden ratio';
export type FileNameFormat = 'ISO Date time' | 'Unix time' | 'Date time';

export const photosPath = './photos';

export type RaspiFileType = 'IMAGE' | 'VIDEO';

export interface RaspiFile {
  type: RaspiFileType;
  name: string;
  base: string;
  ext: string;
  date: number;
  thumb?: string;
}

export interface TimelapseState {
  running?: boolean;
  nextDate?: string;
  nextDates: string[];
}

export interface RaspiStatus {
  running?: boolean;
  streamRunning?: boolean;
  latestFile?: RaspiFile;
  gpioAvailable?: boolean;
  timelapse?: TimelapseState;
}

export interface RaspiGallery {
  files: RaspiFile[];
}
