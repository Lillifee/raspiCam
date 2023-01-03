import * as React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { isDefined } from '../../../shared/helperFunctions';
import { CameraSetting, CameraSettingDesc } from '../../../shared/settings/camera';
import { ControlSetting, ControlSettingDesc } from '../../../shared/settings/control';
import { PhotoSetting, PhotoSettingDesc } from '../../../shared/settings/photo';
import { PreviewSetting, PreviewSettingDesc } from '../../../shared/settings/preview';
import { StreamSetting, StreamSettingDesc } from '../../../shared/settings/stream';
import { VidSetting, VidSettingDesc } from '../../../shared/settings/vid';
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
  vid: VidSettingDesc;
  stream: StreamSettingDesc;
  preview: PreviewSettingDesc;
  control: ControlSettingDesc;

  activateSetting: (setting: ActiveSetting) => void;
  updateCamera: (data: CameraSetting) => void;
  updatePhoto: (data: PhotoSetting) => void;
  updateVid: (data: VidSetting) => void;
  updateStream: (data: StreamSetting) => void;
  updatePreview: (data: PreviewSetting) => void;
  updateControl: (data: ControlSetting) => void;
  setTheme: (theme: DefaultTheme) => void;
}

export const SettingsAdvanced: React.FC<SettingsProps> = ({
  camera,
  photo,
  vid,
  stream,
  preview,
  control,
  activeSetting,
  activateSetting,
  updateCamera,
  updatePhoto,
  updateVid,
  updateStream,
  updatePreview,
  updateControl,
  setTheme,
}) => (
  <SettingsPane>
    <SettingsContainer show={activeSetting === 'Settings'}>
      <CameraSettings data={camera} updateData={updateCamera} />
      <PhotoSettings data={photo} updateData={updatePhoto} />
      <VideoSettings data={vid} updateData={updateVid} />
      <StreamSettings data={stream} updateData={updateStream} />
      <ControlSettings data={control} updateData={updateControl} />
      <PreviewSettings data={preview} updateData={updatePreview} />
      <ApplicationSettings setTheme={setTheme} />
    </SettingsContainer>

    <Filler enableClick={isDefined(activeSetting)} onClick={() => activateSetting(undefined)} />
  </SettingsPane>
);
