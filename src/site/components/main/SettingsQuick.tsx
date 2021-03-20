import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { CameraSettingDesc, CameraSetting } from '../../../shared/settings/camera';
import { PhotoSettingDesc, PhotoSetting } from '../../../shared/settings/photo';
import {
  ExposureSetting,
  ShutterSetting,
  EffectSetting,
  AwbSetting,
} from './settings/CameraSettings';
import { TimelapseSetting } from './settings/PhotoSettings';
import { ActiveSetting, Filler } from './Main';

//#region styled

const QuickSettingsPane = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const FadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const QuickSettingsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: auto;
  grid-column-gap: 2.5em;
  backdrop-filter: blur(3px);
  background-color: rgba(20, 20, 20, 0.8);
  animation: 0.2s ${FadeIn};
  pointer-events: all;
  padding: 0.5em 1em;
`;

//#endregion

export interface QuickSettingsProps {
  activeSetting: ActiveSetting;
  camera: CameraSettingDesc;
  photo: PhotoSettingDesc;

  activateSetting: (setting: ActiveSetting) => void;
  updateCamera: (data: CameraSetting) => void;
  updatePhoto: (data: PhotoSetting) => void;
}

export const SettingsQuick: React.FC<QuickSettingsProps> = ({
  activeSetting,
  camera,
  photo,
  activateSetting,
  updateCamera,
  updatePhoto,
}) => (
  <QuickSettingsPane>
    <QuickSettingsContainer>
      {activeSetting === 'Exposure' && <ExposureSetting data={camera} updateData={updateCamera} />}
      {activeSetting === 'Shutter' && <ShutterSetting data={camera} updateData={updateCamera} />}
      {activeSetting === 'AwbAuto' && <AwbSetting data={camera} updateData={updateCamera} />}
      {activeSetting === 'Effect' && <EffectSetting data={camera} updateData={updateCamera} />}
      {activeSetting === 'Timelapse' && <TimelapseSetting data={photo} updateData={updatePhoto} />}
    </QuickSettingsContainer>

    <Filler enableClick={true} onClick={() => activateSetting(undefined)} />
  </QuickSettingsPane>
);
