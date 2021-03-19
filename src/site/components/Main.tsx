import * as React from 'react';
import styled from 'styled-components';
import {
  photosPath,
  RaspiControlStatus,
  RaspiMode,
  RaspiStatus,
} from '../../shared/settings/types';
import { Icon, IconType } from './common/Icon';
import { ButtonIcon } from './styled/ButtonIcon';

//#region styled

const Container = styled.div`
  z-index: 10;
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
  padding-top: 3em;
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
  padding-top: 4em;
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

const PreviewLink = styled.a`
  pointer-events: all;
`;

const ThumbPreview = styled.img`
  width: 3em;
  height: 3em;
  object-fit: cover;
  border-radius: 3em;
`;

const NoThumbPreview = styled.div`
  display: flex;
  background: ${(p) => p.theme.Background};
  fill: ${(p) => p.theme.Foreground};
  justify-content: center;
  align-items: center;
  width: 3em;
  height: 3em;
  border-radius: 3em;
`;

//#endregion

export interface OverlayProps {
  status: RaspiStatus;
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
};

export const Main: React.FC<OverlayProps> = ({
  status,
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
          <ActionButton running={status.running} onClick={controlAction} />
        </ActionBar>
      </OverflowContainer>
      <OverflowContainer>
        <Toolbar>
          {status.latestFile && (
            <PreviewLink
              target="_blank"
              rel="noreferrer"
              href={`${photosPath}/${status.latestFile.base}`}
            >
              {status.latestFile.thumb ? (
                <ThumbPreview src={`${photosPath}/${status.latestFile.thumb}`} />
              ) : (
                <NoThumbPreview>
                  <Icon type={status.latestFile.type === 'IMAGE' ? 'Photo' : 'Video'} />
                </NoThumbPreview>
              )}
            </PreviewLink>
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
              type={cameraModes[status.mode].icon}
              onClick={() => setShowMode(!showMode)}
            />
          </CameraModeDropdown>

          {!isFullscreen && <ToolbarButton type="Fullscreen" onClick={() => setFullscreen()} />}
        </Toolbar>
      </OverflowContainer>
    </Container>
  );
};
