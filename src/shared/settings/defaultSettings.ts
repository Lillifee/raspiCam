import { CameraSettingDesc } from './camera';
import { controlSettingDesc, ControlSettingDesc } from './control';
import { PhotoSettingDesc, photoSettingDesc } from './photo';
import { PreviewSettingDesc, previewSettingDesc } from './preview';
import { StreamSettingDesc, streamSettingDesc } from './stream';
import { RaspiStatus, Setting } from './types';
import { VidSettingDesc, vidSettingDesc } from './vid';

interface DefaultSettings {
  stream: Setting<StreamSettingDesc>;
  photo: Setting<PhotoSettingDesc>;
  vid: Setting<VidSettingDesc>;
  camera: Setting<CameraSettingDesc>;
  preview: Setting<PreviewSettingDesc>;
  control: Setting<ControlSettingDesc>;
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
  vid: {
    width: vidSettingDesc.width.defaultValue,
    height: vidSettingDesc.height.defaultValue,
    framerate: vidSettingDesc.framerate.defaultValue,
    bitrate: vidSettingDesc.bitrate.defaultValue,
    timeout: 0,
  },
  camera: {},
  preview: {
    nopreview: previewSettingDesc.nopreview.defaultValue,
  },
  control: {
    mode: controlSettingDesc.mode.defaultValue,
  },
};

export const defaultRaspiStatus: RaspiStatus = {};
