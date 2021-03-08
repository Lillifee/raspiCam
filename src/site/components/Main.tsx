import * as React from 'react';
import styled from 'styled-components';
import { RaspiControlStatus, RaspiMode } from '../../shared/settings/types';
import { IconType } from './common/icons';
import { ButtonIcon } from './styled/ButtonIcon';

//#region styled

const Container = styled.div`
  z-index: 100;
  pointer-events: none;
`;

const OverflowContainer = styled.div`
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
`;

const ActionBar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: flex-end;
  padding: 1em;
  margin: 3em;

  @media (orientation: portrait) {
    flex-direction: column;
  }
`;

const Toolbar = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 1em;
`;

const ToolbarFiller = styled.div`
  flex: 1;
`;

const ToolbarButton = styled(ButtonIcon)`
  filter: drop-shadow(0 0 1px black);
  pointer-events: all;
`;

const CameraModeDropdown = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
`;

interface CameraModeListProps {
  show: boolean;
}

const CameraModeList = styled.div<CameraModeListProps>`
  display: flex;
  flex: ${(p) => (p.show ? '1' : '0')};
  overflow: hidden;
  flex-direction: row;
  background: black;
  transition: flex 0.3s;
  border-radius: 2px;
`;

interface ActionButtonProps {
  running?: boolean;
}

const ActionButton = styled.button<ActionButtonProps>`
  width: 3em;
  height: 3em;
  outline: none;
  pointer-events: all;
  border: 3px solid ${(p) => p.theme.Foreground};
  border-radius: ${(p) => (p.running ? '15%' : '50%')};
  background: ${(p) => (p.running ? 'rgba(255,0,0,0.5)' : 'transparent')};
  box-shadow: inset 0 0 5px ${(p) => p.theme.Background};

  :not(:active) {
    transition: background-color 0.5s;
  }
  :active {
    background: white;
  }
`;

const PhotoPreviewLink = styled.a`
  pointer-events: all;
`;

const PhotoPreview = styled.img`
  width: 3em;
  height: 3em;
  object-fit: cover;
  border-radius: 3em;
`;

//#endregion

export interface OverlayProps {
  control: RaspiControlStatus;
  isFullscreen: boolean;
  setControl: (data: RaspiControlStatus) => void;
  controlAction: () => void;
  setFullscreen: () => void;
}

const cameraModes: {
  [K in RaspiMode]: { icon: IconType; name: string };
} = {
  Photo: {
    icon: 'PhotoCamera',
    name: 'Photo',
  },
  Video: {
    icon: 'Videocam',
    name: 'Video',
  },
  Timelapse: {
    icon: 'Timelapse',
    name: 'Timelapse',
  },
};

export const Main: React.FC<OverlayProps> = ({
  control,
  isFullscreen,
  setControl,
  controlAction,
  setFullscreen,
}) => {
  const [showMode, setShowMode] = React.useState(false);

  return (
    <Container>
      <OverflowContainer>
        <ActionBar>
          <ActionButton running={control.running} onClick={controlAction} />
        </ActionBar>
      </OverflowContainer>
      <OverflowContainer>
        <Toolbar>
          {control.lastImagePath && (
            <PhotoPreviewLink
              target="_blank"
              rel="noreferrer"
              href={control.lastImagePath.replace('-preview1', '')}
            >
              <PhotoPreview src={control.lastImagePath} />
            </PhotoPreviewLink>
          )}

          <ToolbarFiller />
          <CameraModeDropdown>
            <CameraModeList show={showMode}>
              {Object.entries(cameraModes).map(([mode, value]) => (
                <ToolbarButton
                  key={mode}
                  type={value.icon}
                  onClick={() => {
                    setControl({ mode: mode as RaspiMode });
                    setShowMode(false);
                  }}
                />
              ))}
            </CameraModeList>
            <ToolbarButton
              type={cameraModes[control.mode || 'Photo'].icon}
              onClick={() => setShowMode(!showMode)}
            />
          </CameraModeDropdown>

          {!isFullscreen && <ToolbarButton type="Fullscreen" onClick={() => setFullscreen()} />}
        </Toolbar>
      </OverflowContainer>
    </Container>
  );
};
