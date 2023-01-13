import * as React from 'react';
import styled from 'styled-components';
import { isDefined } from '../../../shared/helperFunctions';
import { ApplicationSetting, ApplicationSettingDesc } from '../../../shared/settings/application';
import { CameraSetting, CameraSettingDesc } from '../../../shared/settings/camera';
import { ControlSetting, ControlSettingDesc } from '../../../shared/settings/control';
import { PhotoSetting, PhotoSettingDesc } from '../../../shared/settings/photo';
import { PreviewSetting, PreviewSettingDesc } from '../../../shared/settings/preview';
import { StreamSetting, StreamSettingDesc } from '../../../shared/settings/stream';
import { VideoSetting, VideoSettingDesc } from '../../../shared/settings/video';
import { ActiveSetting, Filler } from './Camera';
import { ApplicationSettings } from './settings/ApplicationSettings';
import { CameraSettings } from './settings/CameraSettings';
import { ControlSettings } from './settings/ControlSettings';
import { PhotoSettings } from './settings/PhotoSettings';
import { PreviewSettings } from './settings/PreviewSettings';
import { StreamSettings } from './settings/StreamSettings';
import { VideoSettings } from './settings/VideoSettings';

//#region styled

const SettingsPane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

interface ContainerProps {
  show: boolean;
}

const SettingsContainer = styled.div<ContainerProps>`
  flex: ${(p) => (p.show ? '0.2 1 400px' : 0)};
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
  activeSetting: ActiveSetting;
  camera: CameraSettingDesc;
  photo: PhotoSettingDesc;
  video: VideoSettingDesc;
  stream: StreamSettingDesc;
  preview: PreviewSettingDesc;
  control: ControlSettingDesc;
  application: ApplicationSettingDesc;

  activateSetting: (setting: ActiveSetting) => void;
  updateCamera: (data: CameraSetting) => void;
  updatePhoto: (data: PhotoSetting) => void;
  updateVideo: (data: VideoSetting) => void;
  updateStream: (data: StreamSetting) => void;
  updatePreview: (data: PreviewSetting) => void;
  updateControl: (data: ControlSetting) => void;
  updateApplication: (data: ApplicationSetting) => void;
}

export const SettingsAdvanced: React.FC<SettingsProps> = ({
  camera,
  photo,
  video,
  stream,
  preview,
  control,
  application,
  activeSetting,
  activateSetting,
  updateCamera,
  updatePhoto,
  updateVideo,
  updateStream,
  updatePreview,
  updateControl,
  updateApplication,
}) => (
  <SettingsPane>
    <SettingsContainer show={activeSetting === 'Settings'}>
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
    </SettingsContainer>

    <Filler enableClick={isDefined(activeSetting)} onClick={() => activateSetting(undefined)} />
  </SettingsPane>
);
