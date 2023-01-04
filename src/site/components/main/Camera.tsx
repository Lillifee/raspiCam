import * as React from 'react';
import styled, { DefaultTheme } from 'styled-components';
import { isDefined } from '../../../shared/helperFunctions';
import { applicationSettingDesc } from '../../../shared/settings/application';
import { cameraSettingDesc } from '../../../shared/settings/camera';
import { controlSettingDesc } from '../../../shared/settings/control';
import { defaultRaspiStatus } from '../../../shared/settings/defaultSettings';
import { applySettings } from '../../../shared/settings/helper';
import { photoSettingDesc } from '../../../shared/settings/photo';
import { previewSettingDesc } from '../../../shared/settings/preview';
import { streamSettingDesc } from '../../../shared/settings/stream';
import { RaspiStatus, Setting, BaseTypeSetting } from '../../../shared/settings/types';
import { videoSettingDesc } from '../../../shared/settings/vid';
import { useFetch } from '../common/hooks/useFetch';
import { useFullscreen } from '../common/hooks/useFullscreen';
import { allThemes } from '../theme/themes';
import { Capture } from './Capture';
import { H264Player } from './H264Player';
import { MJPEGPlayer } from './MJPEGPlayer';
import { ModeToolbar } from './ModeToolbar';
import { SettingsAdvanced } from './SettingsAdvanced';
import { SettingsQuick } from './SettingsQuick';
import { SettingsToolbar } from './SettingsToolbar';

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

const useFetchSettings = <T extends { [k in keyof T]: BaseTypeSetting }>(
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

  const [status, , refresh] = useFetch<RaspiStatus>('api/status', defaultRaspiStatus, 1000);

  const [photo, updatePhoto] = useFetchSettings('/api/photo', photoSettingDesc);
  const [vid, updateVid] = useFetchSettings('/api/video', videoSettingDesc);
  const [preview, updatePreview] = useFetchSettings('/api/preview', previewSettingDesc);
  const [camera, updateCamera] = useFetchSettings('/api/camera', cameraSettingDesc, setLoading);
  const [stream, updateStream] = useFetchSettings('/api/stream', streamSettingDesc, setLoading);
  const [control, updateControl] = useFetchSettings('/api/control', controlSettingDesc);
  const [application, updateApplication] = useFetchSettings(
    '/api/application',
    applicationSettingDesc,
  );

  React.useEffect(() => {
    const applicationTheme = allThemes[application.theme.value || 'Dark'];
    setTheme(applicationTheme);
  }, [setTheme, application.theme]);

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

      <SettingsToolbar control={control} active={activeSetting} activate={activateSetting} />

      <MainPane>
        <OverlayContent>
          <ModeToolbar
            status={status.data}
            control={control}
            updateControl={updateControl}
            isFullscreen={isFullscreen}
            setFullscreen={setFullscreen}
          />
        </OverlayContent>

        <OverlayContent>
          <Capture status={status.data} refresh={refresh} />
        </OverlayContent>

        <OverlayContent>
          <SettingsAdvanced
            camera={camera}
            photo={photo}
            video={vid}
            stream={stream}
            preview={preview}
            control={control}
            application={application}
            activeSetting={activeSetting}
            activateSetting={activateSetting}
            updateCamera={updateCamera}
            updatePhoto={updatePhoto}
            updateVideo={updateVid}
            updateStream={updateStream}
            updatePreview={updatePreview}
            updateControl={updateControl}
            updateApplication={updateApplication}
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
