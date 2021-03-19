import * as React from 'react';
import styled, { keyframes } from 'styled-components';
import { isDefined } from '../../shared/helperFunctions';
import { cameraSettingDesc } from '../../shared/settings/camera';
import { applySettings } from '../../shared/settings/helper';
import { photoSettingDesc } from '../../shared/settings/photo';
import { streamSettingDesc } from '../../shared/settings/stream';
import { RaspiStatus, Setting, TypeSetting } from '../../shared/settings/types';
import { vidSettingDesc } from '../../shared/settings/vid';
import { useFetch } from './common/hooks/useFetch';
import {
  CameraSettings,
  ExposureIsoSetting,
  ShutterSetting,
  EffectSetting,
  AwbSetting,
} from './settings/CameraSettings';
import { PhotoSettings, TimelapseSetting } from './settings/PhotoSettings';
import { StreamSettings } from './settings/StreamSettings';
import { VideoSettings } from './settings/VideoSettings';
import { ButtonIcon } from './styled/ButtonIcon';

//#region styled

const Container = styled.div`
  flex: 1;
  flex-direction: column;
  display: flex;
  overflow: hidden;
  z-index: 20;
  pointer-events: none;

  @media (orientation: landscape) {
    flex-direction: row;
  }
`;

const Toolbar = styled.div`
  display: flex;
  flex-direction: row;
  backdrop-filter: blur(5px);
  background-color: rgba(20, 20, 20, 0.8);
  pointer-events: all;

  @media (orientation: landscape) {
    flex-direction: column;
  }
  @media (orientation: landscape) and (max-height: 500px) {
    justify-content: space-between;
  }
  @media (orientation: portrait) and (max-width: 500px) {
    justify-content: space-between;
  }
`;

const ToolbarButton = styled(ButtonIcon)`
  padding: 0.8em;
`;

const Pane = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  overflow: hidden;
`;

const PaneContent = styled.div`
  display: flex;
  grid-row: 1;
  grid-column: 1;
  overflow: hidden;
  z-index: 20;
`;

const HorizontalPane = styled(PaneContent)`
  flex-direction: row;
`;

const VerticalPane = styled(PaneContent)`
  flex-direction: column;
`;

interface SettingsContainerProps {
  show: boolean;
}

const SettingsContainer = styled.div<SettingsContainerProps>`
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

const QuickFadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const QuickSettingContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  grid-auto-rows: auto;
  grid-column-gap: 2.5em;
  backdrop-filter: blur(3px);
  background-color: rgba(20, 20, 20, 0.8);
  animation: 0.2s ${QuickFadeIn};
  pointer-events: all;
  padding: 0.5em 1em;
`;

interface FillerProps {
  enableClick: boolean;
}

const Filler = styled.div<FillerProps>`
  flex: 1;
  display: flex;
  pointer-events: ${(p) => (p.enableClick ? 'all' : 'none')};
`;

//#endregion

type ActiveSetting =
  | 'Settings'
  | 'Timelapse'
  | 'Exposure'
  | 'Effect'
  | 'Shutter'
  | 'AwbAuto'
  | undefined;

const useFetchSettings = <T extends { [k in keyof T]: TypeSetting }>(
  url: RequestInfo,
  settingDesc: T,
  setLoading?: (loading: boolean) => void,
): [T, (data: Setting<T>) => void] => {
  const [state, update] = useFetch<Setting<T>>(url, {});
  const data = applySettings(settingDesc, { ...state.data, ...state.input });

  React.useEffect(() => setLoading?.(state.isUpdating), [setLoading, state.isUpdating]);

  return [data, update];
};

export interface OverlayProps {
  setLoading: (loading: boolean) => void;
  status: RaspiStatus;
}

export const Overlay: React.FC<OverlayProps> = ({ status, setLoading }) => {
  const [activeSetting, setActiveSetting] = React.useState<ActiveSetting>();

  const [photo, updatePhoto] = useFetchSettings('/api/photo', photoSettingDesc);
  const [vid, updateVid] = useFetchSettings('/api/vid', vidSettingDesc);
  const [camera, updateCamera] = useFetchSettings('/api/camera', cameraSettingDesc, setLoading);
  const [stream, updateStream] = useFetchSettings('/api/stream', streamSettingDesc, setLoading);

  const activate = (setting: ActiveSetting) =>
    setActiveSetting((currentSetting) => (currentSetting === setting ? undefined : setting));

  return (
    <Container>
      <Toolbar>
        <ToolbarButton type="Tune" onClick={() => activate('Settings')} />
        <ToolbarButton type="Exposure" onClick={() => activate('Exposure')} />
        <ToolbarButton type="PhotoFilter" onClick={() => activate('Effect')} />
        <ToolbarButton type="WbAuto" onClick={() => activate('AwbAuto')} />

        {status.mode === 'Photo' && (
          <React.Fragment>
            <ToolbarButton type="ShutterSpeed" onClick={() => activate('Shutter')} />
            <ToolbarButton type="Timelapse" onClick={() => activate('Timelapse')} />
          </React.Fragment>
        )}
      </Toolbar>

      <Pane>
        <HorizontalPane>
          <SettingsContainer show={activeSetting === 'Settings'}>
            <CameraSettings data={camera} updateData={updateCamera} />
            <PhotoSettings data={photo} updateData={updatePhoto} />
            <VideoSettings data={vid} updateData={updateVid} />
            <StreamSettings data={stream} updateData={updateStream} />
          </SettingsContainer>

          <Filler
            enableClick={isDefined(activeSetting)}
            onClick={() => setActiveSetting(undefined)}
          />
        </HorizontalPane>

        {isDefined(activeSetting) && activeSetting !== 'Settings' && (
          <VerticalPane>
            <QuickSettingContainer>
              {activeSetting === 'Exposure' && (
                <ExposureIsoSetting data={camera} updateData={updateCamera} />
              )}
              {activeSetting === 'Shutter' && (
                <ShutterSetting data={camera} updateData={updateCamera} />
              )}
              {activeSetting === 'AwbAuto' && (
                <AwbSetting data={camera} updateData={updateCamera} />
              )}
              {activeSetting === 'Effect' && (
                <EffectSetting data={camera} updateData={updateCamera} />
              )}
              {activeSetting === 'Timelapse' && (
                <TimelapseSetting data={photo} updateData={updatePhoto} />
              )}
            </QuickSettingContainer>
            <Filler enableClick={true} onClick={() => setActiveSetting(undefined)} />
          </VerticalPane>
        )}
      </Pane>
    </Container>
  );
};
