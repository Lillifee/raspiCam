import { ApplicationSettingDesc } from './application.js';
import { ButtonSettingDesc, buttonSettingDesc } from './button.js';
import { CameraSettingDesc } from './camera.js';
import { controlSettingDesc, ControlSettingDesc } from './control.js';
import { PhotoSettingDesc, photoSettingDesc } from './photo.js';
import { PreviewSettingDesc, previewSettingDesc } from './preview.js';
import { StreamSettingDesc, streamSettingDesc } from './stream.js';
import { RaspiStatus, Setting } from './types.js';
import { VideoSettingDesc, videoSettingDesc } from './video.js';

interface DefaultSettings {
  stream: Setting<StreamSettingDesc>;
  photo: Setting<PhotoSettingDesc>;
  video: Setting<VideoSettingDesc>;
  camera: Setting<CameraSettingDesc>;
  preview: Setting<PreviewSettingDesc>;
  control: Setting<ControlSettingDesc>;
  application: Setting<ApplicationSettingDesc>;
  button: Setting<ButtonSettingDesc>;
}

export const defaultSettings: DefaultSettings = {
  stream: {
    width: streamSettingDesc.width.defaultValue,
    height: streamSettingDesc.height.defaultValue,
    framerate: streamSettingDesc.framerate.defaultValue,
    codec: streamSettingDesc.codec.defaultValue,
    bitrate: streamSettingDesc.bitrate.defaultValue,
  },
  photo: {
    width: photoSettingDesc.width.defaultValue,
    height: photoSettingDesc.height.defaultValue,
    quality: photoSettingDesc.quality.defaultValue,
    timeout: photoSettingDesc.timeout.defaultValue,
    timelapseTimeout: photoSettingDesc.timelapseTimeout.defaultValue,
  },
  video: {
    width: videoSettingDesc.width.defaultValue,
    height: videoSettingDesc.height.defaultValue,
    framerate: videoSettingDesc.framerate.defaultValue,
    bitrate: videoSettingDesc.bitrate.defaultValue,
    timeout: 0,
  },
  camera: {},
  preview: {
    nopreview: previewSettingDesc.nopreview.defaultValue,
  },
  control: { mode: controlSettingDesc.mode.defaultValue },
  application: {},
  button: {
    gpioPin: buttonSettingDesc.gpioPin.defaultValue,
    debounceTimeout: buttonSettingDesc.debounceTimeout.defaultValue,
    edge: buttonSettingDesc.edge.defaultValue,
  },
};

export const defaultRaspiStatus: RaspiStatus = {};
