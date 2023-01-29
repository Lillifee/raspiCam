import { ApplicationSettingDesc } from './application';
import { ButtonSettingDesc, buttonSettingDesc } from './button';
import { CameraSettingDesc } from './camera';
import { controlSettingDesc, ControlSettingDesc } from './control';
import { PhotoSettingDesc, photoSettingDesc } from './photo';
import { PreviewSettingDesc, previewSettingDesc } from './preview';
import { StreamSettingDesc, streamSettingDesc } from './stream';
import { RaspiStatus, Setting } from './types';
import { VideoSettingDesc, videoSettingDesc } from './video';

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
