import * as React from 'react';
import styled from 'styled-components';
import { isDefined } from '../../../shared/helperFunctions';
import { CameraSetting, CameraSettingDesc } from '../../../shared/settings/camera';
import { PhotoSetting, PhotoSettingDesc } from '../../../shared/settings/photo';
import { PreviewSetting, PreviewSettingDesc } from '../../../shared/settings/preview';
import { StreamSetting, StreamSettingDesc } from '../../../shared/settings/stream';
import { VidSetting, VidSettingDesc } from '../../../shared/settings/vid';
import { ActiveSetting, Filler } from './Main';
import { CameraSettings } from './settings/CameraSettings';
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
  background-color: rgba(20, 20, 20, 0.8);
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

  activateSetting: (setting: ActiveSetting) => void;
  updateCamera: (data: CameraSetting) => void;
  updatePhoto: (data: PhotoSetting) => void;
  updateVid: (data: VidSetting) => void;
  updateStream: (data: StreamSetting) => void;
  updatePreview: (data: PreviewSetting) => void;
}

export const SettingsAdvanced: React.FC<SettingsProps> = ({
  camera,
  photo,
  vid,
  stream,
  preview,
  activeSetting,
  activateSetting,
  updateCamera,
  updatePhoto,
  updateVid,
  updateStream,
  updatePreview,
}) => {
  return (
    <SettingsPane>
      <SettingsContainer show={activeSetting === 'Settings'}>
        <CameraSettings data={camera} updateData={updateCamera} />
        <PhotoSettings data={photo} updateData={updatePhoto} />
        <VideoSettings data={vid} updateData={updateVid} />
        <StreamSettings data={stream} updateData={updateStream} />
        <PreviewSettings data={preview} updateData={updatePreview} />
      </SettingsContainer>

      <Filler enableClick={isDefined(activeSetting)} onClick={() => activateSetting(undefined)} />
    </SettingsPane>
  );
};
