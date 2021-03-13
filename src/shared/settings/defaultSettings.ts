import { CameraSettingDesc } from './camera';
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
}

export const defaultSettings: DefaultSettings = {
  stream: {
    width: streamSettingDesc.width.defaultValue,
    height: streamSettingDesc.height.defaultValue,
    framerate: streamSettingDesc.framerate.defaultValue,
    qp: streamSettingDesc.qp.defaultValue,
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
    qp: vidSettingDesc.qp.defaultValue,
    timeout: 0,
  },
  camera: {},
  preview: {
    nopreview: previewSettingDesc.nopreview.defaultValue,
  },
};

export const defaultRaspiStatus: RaspiStatus = {
  mode: 'Photo',
};
