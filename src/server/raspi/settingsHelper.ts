import path from 'path';
import { shallowEqualObjects } from '../../shared/helperFunctions';
import {
  vidSettingDesc,
  stillSettingDesc,
  cameraSettingDesc,
  previewSettingDesc,
  streamSettingDesc,
  extractSettings,
  applySettings,
  GenericSettingDesc,
  Setting,
  baseSettings,
  cameraSettingConverter,
} from '../../shared/settings';

export const PhotosPath = './photos';
export const PhotosAbsPath = path.join(__dirname, PhotosPath);

/**
 * Settings base functions
 */
const settingsBase = <T extends GenericSettingDesc>(
  settingDescription: T,
  defaultSettings: Setting<T>,
  convertSettings?: (settings: Setting<T>) => Setting<T>,
) => {
  let settingDesc = settingDescription;

  const read = () => extractSettings(settingDesc);
  const convert = () => (convertSettings ? convertSettings(read()) : read());
  const apply = (settings: Setting<T>): boolean => {
    const curSettings = read();

    if (!shallowEqualObjects(curSettings, settings)) {
      settingDesc = applySettings(settingDesc, { ...defaultSettings, ...settings });
      return true;
    }
    return false;
  };

  apply(defaultSettings);
  return { read, convert, apply };
};

export type SettingsBase = ReturnType<typeof settingsBase>;

const stream = settingsBase(streamSettingDesc, baseSettings.stream);
const still = settingsBase(stillSettingDesc, baseSettings.still);
const vid = settingsBase(vidSettingDesc, baseSettings.vid);
const camera = settingsBase(cameraSettingDesc, baseSettings.camera, cameraSettingConverter);
const preview = settingsBase(previewSettingDesc, baseSettings.preview);

export interface SettingsHelper {
  stream: typeof stream;
  still: typeof still;
  vid: typeof vid;
  camera: typeof camera;
  preview: typeof preview;
}

export const createSettingsHelper = (): SettingsHelper => ({ stream, still, vid, camera, preview });
