import * as React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { isDefined } from '../../../shared/helperFunctions';
import { cameraSettingDesc } from '../../../shared/settings/camera';
import { defaultRaspiStatus } from '../../../shared/settings/defaultSettings';
import { applySettings } from '../../../shared/settings/helper';
import { photoSettingDesc } from '../../../shared/settings/photo';
import { previewSettingDesc } from '../../../shared/settings/preview';
import { stepperSettingDesc } from '../../../shared/settings/stepper';
import { streamSettingDesc } from '../../../shared/settings/stream';
import { RaspiStatus, Setting, TypeSetting } from '../../../shared/settings/types';
import { vidSettingDesc } from '../../../shared/settings/vid';
import { useFetch } from '../common/hooks/useFetch';
import { useFullscreen } from '../common/hooks/useFullscreen';
import { Capture } from './Capture';
import { H264Player } from './H264Player';
import { MJPEGPlayer } from './MJPEGPlayer';
import { ModeToolbar } from './ModeToolbar';
import { SettingsAdvanced } from './SettingsAdvanced';
import { SettingsQuick } from './SettingsQuick';
import { SettingsToolbar } from './SettingsToolbar';
import { StepperControl } from './StepperControl';

//#region styled

export const OverlayContent = styled.div`
  display: flex;
  grid-row: 1;
  grid-column: 1;
  overflow: hidden;
  z-index: 20;
`;

export interface FillerProps {
  enableClick: boolean;
}

export const Filler = styled.div<FillerProps>`
  flex: 1;
  display: flex;
  pointer-events: ${(p) => (p.enableClick ? 'all' : 'none')};
`;

const MainContainer = styled.div`
  flex: 1;
  flex-direction: column;
  display: flex;
  overflow: hidden;
  z-index: 20;
  pointer-events: none;
  background: ${(p) => p.theme.RootBackground};
  @media (orientation: landscape) {
    flex-direction: row;
  }
`;

const MainPane = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  overflow: hidden;
`;

const PlayerWrapper = styled.section`
  flex: 1;
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
`;

//#endregion

export type ActiveSetting =
  | 'Settings'
  | 'Timelapse'
  | 'Exposure'
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

export interface Props {
  setTheme: (theme: DefaultTheme) => void;
}

export const Camera: React.FC<Props> = ({ setTheme }) => {
  const mainRef = React.useRef<HTMLDivElement>(null);
  const [isFullscreen, setFullscreen] = useFullscreen(mainRef);

  const [loading, setLoading] = React.useState(false);
  const [activeSetting, setActiveSetting] = React.useState<ActiveSetting>();

  const [status, setControl, refresh] = useFetch<RaspiStatus>(
    'api/control',
    defaultRaspiStatus,
    1000,
  );

  const [photo, updatePhoto] = useFetchSettings('/api/photo', photoSettingDesc);
  const [vid, updateVid] = useFetchSettings('/api/vid', vidSettingDesc);
  const [preview, updatePreview] = useFetchSettings('/api/preview', previewSettingDesc);
  const [stepperX, updateStepperX] = useFetchSettings('/api/stepperX', stepperSettingDesc);
  const [stepperY, updateStepperY] = useFetchSettings('/api/stepperY', stepperSettingDesc);
  const [camera, updateCamera] = useFetchSettings('/api/camera', cameraSettingDesc, setLoading);
  const [stream, updateStream] = useFetchSettings('/api/stream', streamSettingDesc, setLoading);

  const activateSetting = (setting: ActiveSetting) =>
    setActiveSetting((currentSetting) => (currentSetting === setting ? undefined : setting));

  return (
    <MainContainer ref={mainRef}>
      <PlayerWrapper>
        {stream.codec.value === 'MJPEG' ? (
          <MJPEGPlayer loading={loading || !!status.data.running} />
        ) : (
          <H264Player loading={loading} />
        )}
      </PlayerWrapper>

      <SettingsToolbar status={status.data} active={activeSetting} activate={activateSetting} />

      <MainPane>
        <OverlayContent>
          <ModeToolbar
            status={status.data}
            setControl={setControl}
            isFullscreen={isFullscreen}
            setFullscreen={setFullscreen}
          />
        </OverlayContent>

        <OverlayContent>
          <Capture status={status.data} refresh={refresh} />
        </OverlayContent>

        {(stepperX.enabled.value || stepperY.enabled.value) && (
          <OverlayContent>
            <StepperControl />
          </OverlayContent>
        )}

        <OverlayContent>
          <SettingsAdvanced
            camera={camera}
            photo={photo}
            vid={vid}
            stream={stream}
            preview={preview}
            stepperX={stepperX}
            stepperY={stepperY}
            activeSetting={activeSetting}
            activateSetting={activateSetting}
            updateCamera={updateCamera}
            updatePhoto={updatePhoto}
            updateVid={updateVid}
            updateStream={updateStream}
            updatePreview={updatePreview}
            updateStepperX={updateStepperX}
            updateStepperY={updateStepperY}
            setTheme={setTheme}
          />
        </OverlayContent>

        {isDefined(activeSetting) && activeSetting !== 'Settings' && (
          <OverlayContent>
            <SettingsQuick
              camera={camera}
              photo={photo}
              activeSetting={activeSetting}
              activateSetting={activateSetting}
              updateCamera={updateCamera}
              updatePhoto={updatePhoto}
            />
          </OverlayContent>
        )}
      </MainPane>
    </MainContainer>
  );
};
