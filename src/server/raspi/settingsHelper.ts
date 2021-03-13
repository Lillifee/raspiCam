import { shallowEqualObjects } from '../../shared/helperFunctions';
import { cameraSettingDesc, cameraSettingConverter } from '../../shared/settings/camera';
import { defaultSettings } from '../../shared/settings/defaultSettings';
import { extractSettings, applySettings } from '../../shared/settings/helper';
import { photoSettingConverter, photoSettingDesc } from '../../shared/settings/photo';
import { previewSettingDesc } from '../../shared/settings/preview';
import { streamSettingDesc } from '../../shared/settings/stream';
import { timelapseSettingDesc } from '../../shared/settings/timelapse';
import { GenericSettingDesc, Setting } from '../../shared/settings/types';
import { vidSettingDesc } from '../../shared/settings/vid';

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

const stream = settingsBase(streamSettingDesc, defaultSettings.stream);
const photo = settingsBase(photoSettingDesc, defaultSettings.photo, photoSettingConverter);
const timelapse = settingsBase(timelapseSettingDesc, defaultSettings.timelapse);
const vid = settingsBase(vidSettingDesc, defaultSettings.vid);
const camera = settingsBase(cameraSettingDesc, defaultSettings.camera, cameraSettingConverter);
const preview = settingsBase(previewSettingDesc, defaultSettings.preview);

export interface SettingsHelper {
  stream: typeof stream;
  photo: typeof photo;
  timelapse: typeof timelapse;
  vid: typeof vid;
  camera: typeof camera;
  preview: typeof preview;
}

export const createSettingsHelper = (): SettingsHelper => ({
  stream,
  photo,
  timelapse,
  vid,
  camera,
  preview,
});
