import * as React from 'react';
import styled from 'styled-components';
import { raspiCameraParseSettings, raspiVidParseSettings } from '../../shared/raspiParseSettings';
import { ButtonIcon } from './common/icons';
import { Settings } from './settings/StreamSettings';

//#region styled

const Container = styled.div`
  flex: 1;
  flex-direction: row;
  display: flex;
  overflow: hidden;
  z-index: 50;
`;

const Toolbar = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0.4em;
  backdrop-filter: blur(5px);
  background-color: rgba(20, 20, 20, 0.8);
`;

interface SettingsContainerProps {
  show: boolean;
}

const SettingsContainer = styled.div<SettingsContainerProps>`
  flex: ${(p) => (p.show ? 'auto' : 0)};
  max-width: ${(p) => p.show && '500px'};
  flex-direction: column;
  display: flex;
  overflow: auto;
  backdrop-filter: blur(5px);
  background-color: rgba(15, 15, 15, 0.8);
  color: ${(p) => p.theme.Foreground};
  transition: flex ease-in-out 0.2s;
`;

const Main = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const Actionbar = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 1em;
`;

const ActionButton = styled(ButtonIcon)`
  filter: drop-shadow(0 0 1px black);
`;

//#endregion

export interface OverlayProps {
  isFullscreen: boolean;
  setLoading: (loading: boolean) => void;
  setFullscreen: () => void;
}

export const Overlay: React.FC<OverlayProps> = ({ isFullscreen, setFullscreen, setLoading }) => {
  const [showSettings, setShowSettings] = React.useState(false);
  return (
    <Container>
      <Toolbar>
        <ButtonIcon type="Tune" onClick={() => setShowSettings(!showSettings)} />
      </Toolbar>
      <SettingsContainer show={showSettings}>
        <Settings
          name="Stream"
          url="/api/stream"
          setLoading={setLoading}
          parseSettings={raspiVidParseSettings}
        />
        <Settings
          name="Camera"
          url="/api/camera"
          setLoading={setLoading}
          parseSettings={raspiCameraParseSettings}
        />
        {/* <VidSettings url="/api/vid" />
        <StillSettings url="/api/still" />
        <PreviewSettings url="/api/preview" /> */}
      </SettingsContainer>
      <Main onClick={() => setShowSettings(false)}>
        <Actionbar>
          {!isFullscreen && <ActionButton type="Fullscreen" onClick={() => setFullscreen()} />}
        </Actionbar>
      </Main>
    </Container>
  );
};
