import fs from 'fs';
import path from 'path';
import { shallowEqualObjects } from '../shared/helperFunctions';
import { cameraSettingConverter, cameraSettingDesc } from '../shared/settings/camera';
import { defaultSettings } from '../shared/settings/defaultSettings';
import { applySettings, extractSettings } from '../shared/settings/helper';
import { photoSettingConverter, photoSettingDesc } from '../shared/settings/photo';
import { previewSettingDesc } from '../shared/settings/preview';
import { streamSettingDesc } from '../shared/settings/stream';
import { GenericSettingDesc, Setting } from '../shared/settings/types';
import { vidSettingDesc } from '../shared/settings/vid';
import { createLogger } from './logger';

const logger = createLogger('settings');
const settingsFolder = path.join(__dirname, 'settings');

/**
 * Settings base functions
 */
const settingsBase = <T extends GenericSettingDesc>(
  fileName: string,
  settingDescription: T,
  defaultSettings: Setting<T>,
  convertSettings?: (settings: Setting<T>) => Setting<T>,
) => {
  const settingsFilePath = path.join(settingsFolder, fileName);
  let settingDesc = applySettings(settingDescription, defaultSettings);

  /**
   * Extract the settings from the description
   */
  const read = () => extractSettings(settingDesc);

  /**
   * Convert and read the settings
   */
  const convert = () => (convertSettings ? convertSettings(read()) : read());

  /**
   * Apply the new settings
   */
  const apply = (settings: Setting<T>): boolean => {
    const curSettings = read();

    if (!shallowEqualObjects(curSettings, settings)) {
      settingDesc = applySettings(settingDesc, { ...defaultSettings, ...settings });
      save(settings);
      return true;
    }
    return false;
  };

  /**
   * Save the settings to file
   */
  const save = (settings: Setting<T>) =>
    fs.writeFile(settingsFilePath, JSON.stringify(settings), (err) => {
      err && logger.error(`failed to write settings to ${fileName}: ${err.message}`);
    });

  /**
   * Load the settings from file
   */
  const load = () => {
    try {
      fs.accessSync(settingsFilePath);
      const settings = JSON.parse(fs.readFileSync(settingsFilePath, 'utf-8')) as Setting<T>;
      settingDesc = applySettings(settingDesc, { ...defaultSettings, ...settings });
    } catch (err) {
      // Nothing to do here.
    }
  };

  load();

  return { read, convert, apply };
};

export type SettingsBase = ReturnType<typeof settingsBase>;

export const createSettingsHelper = () => {
  if (!fs.existsSync(settingsFolder)) {
    fs.mkdirSync(settingsFolder);
  }

  return {
    stream: settingsBase('stream.json', streamSettingDesc, defaultSettings.stream),
    photo: settingsBase(
      'photo.json',
      photoSettingDesc,
      defaultSettings.photo,
      photoSettingConverter,
    ),
    vid: settingsBase('vid.json', vidSettingDesc, defaultSettings.vid),
    camera: settingsBase(
      'camera.json',
      cameraSettingDesc,
      defaultSettings.camera,
      cameraSettingConverter,
    ),
    preview: settingsBase('preview.json', previewSettingDesc, defaultSettings.preview),
  };
};

export type SettingsHelper = ReturnType<typeof createSettingsHelper>;
