import * as React from 'react';
import styled from 'styled-components';
import { CameraMode } from './App';
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

const TakePhotoButton = styled.button`
  width: 3em;
  height: 3em;
  border: 3px solid ${(p) => p.theme.Foreground};
  border-radius: 50%;
  background: transparent;
  pointer-events: all;
  outline: none;
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
  mode: CameraMode;
  isFullscreen: boolean;
  setMode: (mode: CameraMode) => void;
  setFullscreen: () => void;
}

const cameraModes: { [K in CameraMode]: { icon: IconType; name: string } } = {
  Photo: { icon: 'PhotoCamera', name: 'Photo' },
  Video: { icon: 'Videocam', name: 'Video' },
  Timelapse: { icon: 'Timelapse', name: 'Timelapse' },
};

const useCapturePhoto = (url: RequestInfo): [string, () => void] => {
  const [photoPath, setPhotoPath] = React.useState('');
  const capturePhoto = React.useCallback(() => {
    fetch(url)
      .then((res) => res.text())
      .then((path) => setPhotoPath(path))
      .catch((error) => {
        console.log('Take photo failed', error);
      });
  }, [url]);
  return [photoPath, capturePhoto];
};

export const Main: React.FC<OverlayProps> = ({ mode, isFullscreen, setMode, setFullscreen }) => {
  const [showMode, setShowMode] = React.useState(false);
  const [photoPath, capturePhoto] = useCapturePhoto('/api/photo/capture');

  return (
    <Container>
      <OverflowContainer>
        <ActionBar>
          <TakePhotoButton onClick={capturePhoto} />
        </ActionBar>
      </OverflowContainer>
      <OverflowContainer>
        <Toolbar>
          {photoPath && (
            <PhotoPreviewLink
              target="_blank"
              rel="noreferrer"
              href={photoPath.replace('-preview1', '')}
            >
              <PhotoPreview src={photoPath} />
            </PhotoPreviewLink>
          )}

          <ToolbarFiller />
          <CameraModeDropdown>
            <CameraModeList show={showMode}>
              {Object.entries(cameraModes).map(([key, value]) => (
                <ToolbarButton
                  key={key}
                  type={value.icon}
                  onClick={() => {
                    setMode(key as CameraMode);
                    setShowMode(false);
                  }}
                />
              ))}
            </CameraModeList>
            <ToolbarButton type={cameraModes[mode].icon} onClick={() => setShowMode(!showMode)} />
          </CameraModeDropdown>

          {!isFullscreen && <ToolbarButton type="Fullscreen" onClick={() => setFullscreen()} />}
        </Toolbar>
      </OverflowContainer>
    </Container>
  );
};
