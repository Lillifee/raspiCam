import * as React from 'react';
import styled from 'styled-components';
import { CameraMode } from './App';
import { ButtonIcon } from './common/icons';
import { CameraSettings } from './settings/CameraSettings';
import { StreamSettings } from './settings/StreamSettings';

//#region styled

const Container = styled.div`
  flex: 1;
  flex-direction: row;
  display: flex;
  overflow: hidden;
  z-index: 200;
  pointer-events: none;
`;

const Toolbar = styled.div`
  display: flex;
  flex-direction: column;

  padding: 0.4em;
  backdrop-filter: blur(5px);
  background-color: rgba(20, 20, 20, 0.8);
  pointer-events: all;
`;

interface SettingsContainerProps {
  show: boolean;
}

const SettingsContainer = styled.div<SettingsContainerProps>`
  flex: ${(p) => (p.show ? '0.3 1 350px' : 0)};
  flex-direction: column;
  display: flex;
  overflow-y: scroll;
  backdrop-filter: blur(5px);
  background-color: rgba(20, 20, 20, 0.8);
  color: ${(p) => p.theme.Foreground};
  transition: flex 0.3s;
  pointer-events: all;
`;

interface FillerProps {
  enableClick: boolean;
}

const Filler = styled.div<FillerProps>`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  pointer-events: ${(p) => (p.enableClick ? 'all' : 'none')};
`;

//#endregion

export interface OverlayProps {
  mode: CameraMode;
  setLoading: (loading: boolean) => void;
}

export const Overlay: React.FC<OverlayProps> = ({ setLoading }) => {
  const [showSettings, setShowSettings] = React.useState(false);

  return (
    <Container>
      <Toolbar>
        <ButtonIcon type="Tune" onClick={() => setShowSettings(!showSettings)} />
      </Toolbar>
      <SettingsContainer show={showSettings}>
        <CameraSettings setLoading={setLoading} />
        <StreamSettings setLoading={setLoading} />
      </SettingsContainer>
      <Filler enableClick={showSettings} onClick={() => setShowSettings(false)} />
    </Container>
  );
};
