import * as React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { isDefined } from '../../../shared/helperFunctions';
import { CameraSetting, CameraSettingDesc } from '../../../shared/settings/camera';
import { PhotoSetting, PhotoSettingDesc } from '../../../shared/settings/photo';
import { PreviewSetting, PreviewSettingDesc } from '../../../shared/settings/preview';
import { StepperSetting, StepperSettingDesc } from '../../../shared/settings/stepper';
import { StreamSetting, StreamSettingDesc } from '../../../shared/settings/stream';
import { VidSetting, VidSettingDesc } from '../../../shared/settings/vid';
import { ActiveSetting, Filler } from './Camera';
import { ApplicationSettings } from './settings/ApplicationSettings';
import { CameraSettings } from './settings/CameraSettings';
import { PhotoSettings } from './settings/PhotoSettings';
import { PreviewSettings } from './settings/PreviewSettings';
import { StepperSettings } from './settings/StepperSettings';
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
  stepperX: StepperSettingDesc;
  stepperY: StepperSettingDesc;

  activateSetting: (setting: ActiveSetting) => void;
  updateCamera: (data: CameraSetting) => void;
  updatePhoto: (data: PhotoSetting) => void;
  updateVid: (data: VidSetting) => void;
  updateStream: (data: StreamSetting) => void;
  updatePreview: (data: PreviewSetting) => void;
  updateStepperX: (data: StepperSetting) => void;
  updateStepperY: (data: StepperSetting) => void;
  setTheme: (theme: DefaultTheme) => void;
}

export const SettingsAdvanced: React.FC<SettingsProps> = ({
  camera,
  photo,
  vid,
  stream,
  preview,
  stepperX,
  stepperY,
  activeSetting,
  activateSetting,
  updateCamera,
  updatePhoto,
  updateVid,
  updateStream,
  updatePreview,
  updateStepperX,
  updateStepperY,
  setTheme,
}) => (
  <SettingsPane>
    <SettingsContainer show={activeSetting === 'Settings'}>
      <CameraSettings data={camera} updateData={updateCamera} />
      <PhotoSettings data={photo} updateData={updatePhoto} />
      <VideoSettings data={vid} updateData={updateVid} />
      <StreamSettings data={stream} updateData={updateStream} />
      <PreviewSettings data={preview} updateData={updatePreview} />
      <StepperSettings
        stepperX={stepperX}
        stepperY={stepperY}
        updateStepperX={updateStepperX}
        updateStepperY={updateStepperY}
      />
      <ApplicationSettings setTheme={setTheme} />
    </SettingsContainer>

    <Filler enableClick={isDefined(activeSetting)} onClick={() => activateSetting(undefined)} />
  </SettingsPane>
);
