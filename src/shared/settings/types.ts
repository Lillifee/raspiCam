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

export type GenericSettingDesc = Record<string, BaseTypeSetting>;
export type Setting<T extends { [k in keyof T]: BaseTypeSetting }> = {
  [K in keyof T]?: T[K]['value'];
};

export type RaspiMode = 'Photo' | 'Video';

export const photosPath = './photos';
export const raspiModes: RaspiMode[] = ['Photo', 'Video'];

export type RaspiFileType = 'IMAGE' | 'VIDEO';

export interface RaspiFile {
  type: RaspiFileType;
  name: string;
  base: string;
  ext: string;
  date: number;
  thumb?: string;
}

export interface RaspiStatus {
  running?: boolean;
  streamRunning?: boolean;
  latestFile?: RaspiFile;
}

export interface RaspiGallery {
  files: RaspiFile[];
}
