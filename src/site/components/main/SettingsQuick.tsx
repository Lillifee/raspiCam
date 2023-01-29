import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { CameraSetting, CameraSettingDesc } from '../../../shared/settings/camera.js';
import { PhotoSetting, PhotoSettingDesc } from '../../../shared/settings/photo.js';
import { ActiveSetting, Filler } from './Camera.js';
import { AwbSetting, ExposureSetting, ShutterSetting } from './settings/CameraSettings.js';
import { TimelapseSetting } from './settings/PhotoSettings.js';

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
  background-color: ${(p) => p.theme.LayerBackground};
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
      {activeSetting === 'Exposure' && (
        <ExposureSetting camera={camera} updateCamera={updateCamera} />
      )}
      {activeSetting === 'Shutter' && (
        <ShutterSetting camera={camera} updateCamera={updateCamera} />
      )}
      {activeSetting === 'AwbAuto' && <AwbSetting camera={camera} updateCamera={updateCamera} />}
      {activeSetting === 'Timelapse' && (
        <TimelapseSetting photo={photo} updatePhoto={updatePhoto} />
      )}
    </QuickSettingsContainer>

    <Filler $enableClick={true} onClick={() => activateSetting(undefined)} />
  </QuickSettingsPane>
);
