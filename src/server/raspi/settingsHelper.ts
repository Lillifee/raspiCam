import path from 'path';
import { isDefined, shallowEqualObjects } from '../../shared/helperFunctions';
import {
  ParseSetting,
  ParseSettings,
  raspiPreviewParseSettings,
  raspiStillParseSettings,
  raspiVidParseSettings,
} from '../../shared/raspiParseSettings';
import { raspiCameraParseSettings } from '../../shared/raspiParseSettings';
import {
  RaspiCameraSettings,
  RaspiPreviewSettings,
  RaspiStillSettings,
  RaspiVidSettings,
} from '../../shared/raspiSettings';

export const PhotosPath = './photos';
export const PhotosAbsPath = path.join(__dirname, PhotosPath);

/**
 * Parse the settings
 */
export const parseSettings = <T>(
  object: Record<string, any>,
  parse: ParseSettings<Partial<T>>,
): Partial<T> =>
  Object.entries(parse).reduce<Partial<T>>((result, [key, settings]) => {
    const curValue = object[key];
    const parseSetting = settings as ParseSetting;
    const value = curValue && parseSetting.convert(curValue.toString());
    return isDefined(value) ? { ...result, [key]: value } : result;
  }, {});

/**
 * Settings base functions
 */
const settingsBase = <T>(parseSetting: ParseSettings<Partial<T>>) => () => {
  let curSettings: Partial<T> = {};
  const get = (): Partial<T> => curSettings;
  const parse = (object: Record<string, any>): Partial<T> => parseSettings(object, parseSetting);
  const apply = (settings: Partial<T>): boolean => {
    if (shallowEqualObjects(curSettings, settings)) {
      return false;
    } else {
      curSettings = settings;
      return true;
    }
  };
  return { get, parse, apply };
};

const streamSettings = settingsBase<RaspiVidSettings>(raspiVidParseSettings)();
const stillSettings = settingsBase<RaspiStillSettings>(raspiStillParseSettings)();
const vidSettings = settingsBase<RaspiVidSettings>(raspiVidParseSettings)();
const cameraSettings = settingsBase<RaspiCameraSettings>(raspiCameraParseSettings)();
const previewSettings = settingsBase<RaspiPreviewSettings>(raspiPreviewParseSettings)();

type StreamSettings = typeof streamSettings;
type StillSettings = typeof stillSettings;
type VidSettings = typeof vidSettings;
type CameraSettings = typeof cameraSettings;
type PreviewSettings = typeof previewSettings;

export type SettingsBase =
  | StreamSettings
  | StillSettings
  | VidSettings
  | CameraSettings
  | PreviewSettings;

export interface SettingsHelper {
  stream: StreamSettings;
  still: StillSettings;
  vid: VidSettings;
  camera: CameraSettings;
  preview: PreviewSettings;
}

export const createSettingsHelper = (): SettingsHelper => ({
  stream: streamSettings,
  still: stillSettings,
  vid: vidSettings,
  camera: cameraSettings,
  preview: previewSettings,
});
