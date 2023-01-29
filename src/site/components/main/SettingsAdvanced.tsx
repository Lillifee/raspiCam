import * as React from 'react';
import { styled } from 'styled-components';
import { isDefined } from '../../../shared/helperFunctions.js';
import {
  ApplicationSetting,
  ApplicationSettingDesc,
} from '../../../shared/settings/application.js';
import { ButtonSetting, ButtonSettingDesc } from '../../../shared/settings/button.js';
import { CameraSetting, CameraSettingDesc } from '../../../shared/settings/camera.js';
import { ControlSetting, ControlSettingDesc } from '../../../shared/settings/control.js';
import { PhotoSetting, PhotoSettingDesc } from '../../../shared/settings/photo.js';
import { PreviewSetting, PreviewSettingDesc } from '../../../shared/settings/preview.js';
import { StreamSetting, StreamSettingDesc } from '../../../shared/settings/stream.js';
import { RaspiStatus } from '../../../shared/settings/types.js';
import { VideoSetting, VideoSettingDesc } from '../../../shared/settings/video.js';
import { ActiveSetting, Filler } from './Camera.js';
import { ApplicationSettings } from './settings/ApplicationSettings.js';
import { ButtonSettings } from './settings/ButtonSettings.js';
import { CameraSettings } from './settings/CameraSettings.js';
import { ControlSettings } from './settings/ControlSettings.js';
import { PhotoSettings } from './settings/PhotoSettings.js';
import { PreviewSettings } from './settings/PreviewSettings.js';
import { StreamSettings } from './settings/StreamSettings.js';
import { VideoSettings } from './settings/VideoSettings.js';

//#region styled

const SettingsPane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

interface ContainerProps {
  $show: boolean;
}

const SettingsContainer = styled.div<ContainerProps>`
  flex: ${(p) => (p.$show ? '0.2 1 400px' : 0)};
  flex-direction: column;
  display: flex;
  overflow-y: scroll;
  backdrop-filter: blur(5px);
  background-color: ${(p) => p.theme.LayerBackground};
  color: ${(p) => p.theme.Foreground};
  transition: flex 0.2s;
  pointer-events: all;
`;

//#endregion

export interface SettingsProps {
  status: RaspiStatus;
  activeSetting: ActiveSetting;
  camera: CameraSettingDesc;
  photo: PhotoSettingDesc;
  video: VideoSettingDesc;
  stream: StreamSettingDesc;
  preview: PreviewSettingDesc;
  control: ControlSettingDesc;
  button: ButtonSettingDesc;
  application: ApplicationSettingDesc;
  activateSetting: (setting: ActiveSetting) => void;
  updateCamera: (data: CameraSetting) => void;
  updatePhoto: (data: PhotoSetting) => void;
  updateVideo: (data: VideoSetting) => void;
  updateStream: (data: StreamSetting) => void;
  updatePreview: (data: PreviewSetting) => void;
  updateControl: (data: ControlSetting) => void;
  updateApplication: (data: ApplicationSetting) => void;
  updateButton: (data: ButtonSetting) => void;
}

export const SettingsAdvanced: React.FC<SettingsProps> = ({
  status,
  camera,
  photo,
  video,
  stream,
  preview,
  control,
  button,
  application,
  activeSetting,
  activateSetting,
  updateCamera,
  updatePhoto,
  updateVideo,
  updateStream,
  updatePreview,
  updateControl,
  updateButton,
  updateApplication,
}) => (
  <SettingsPane>
    <SettingsContainer $show={activeSetting === 'Settings'}>
      <CameraSettings camera={camera} updateCamera={updateCamera} />

      <ControlSettings control={control} updateControl={updateControl} />

      {control.mode.value === 'Photo' && <PhotoSettings photo={photo} updatePhoto={updatePhoto} />}

      {control.mode.value === 'Video' && <VideoSettings video={video} updateVideo={updateVideo} />}

      <StreamSettings
        stream={stream}
        updateStream={updateStream}
        application={application}
        updateApplication={updateApplication}
      />

      <PreviewSettings preview={preview} updatePreview={updatePreview} />

      <ApplicationSettings application={application} updateApplication={updateApplication} />

      <ButtonSettings status={status} button={button} updateButton={updateButton} />
    </SettingsContainer>

    <Filler $enableClick={isDefined(activeSetting)} onClick={() => activateSetting(undefined)} />
  </SettingsPane>
);
