import { CameraSettingDesc } from './camera';
import { PhotoSettingDesc, photoSettingDesc } from './photo';
import { PreviewSettingDesc, previewSettingDesc } from './preview';
import { stepperSettingDesc, StepperSettingDesc } from './stepper';
import { StreamSettingDesc, streamSettingDesc } from './stream';
import { RaspiStatus, Setting } from './types';
import { VidSettingDesc, vidSettingDesc } from './vid';

interface DefaultSettings {
  stream: Setting<StreamSettingDesc>;
  photo: Setting<PhotoSettingDesc>;
  vid: Setting<VidSettingDesc>;
  camera: Setting<CameraSettingDesc>;
  preview: Setting<PreviewSettingDesc>;
  xAxis: Setting<StepperSettingDesc>;
  yAxis: Setting<StepperSettingDesc>;
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
  xAxis: {
    enabled: false,
    maxSpeed: stepperSettingDesc.maxSpeed.defaultValue,
    acceleration: stepperSettingDesc.acceleration.defaultValue,
    stepPin: 27,
    dirPin: 17,
    enaPin: 22,
  },
  yAxis: {
    enabled: false,
    maxSpeed: stepperSettingDesc.maxSpeed.defaultValue,
    acceleration: stepperSettingDesc.acceleration.defaultValue,
    stepPin: 9,
    dirPin: 10,
    enaPin: 11, // todo use both ena pins?
  },
};

export const defaultRaspiStatus: RaspiStatus = {
  mode: 'Photo',
};
