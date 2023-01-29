import * as React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ControlSetting, ControlSettingDesc } from '../../../shared/settings/control.js';
import { RaspiMode, RaspiStatus, photosPath } from '../../../shared/settings/types.js';
import { Icon, IconType } from '../common/Icon.js';
import { ButtonIcon } from '../styled/ButtonIcon.js';

//#region styled

const ModeToolbarContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 1em;

  @media (orientation: portrait) {
    flex-direction: row;
  }
`;

const ToolbarFiller = styled.div`
  flex: 1;
`;

const ToolbarButton = styled(ButtonIcon)`
  filter: drop-shadow(0px 0px 2px ${(p) => p.theme?.Background});
  pointer-events: all;
`;

const CameraModeDropdown = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-end;
`;

interface CameraModeListProps {
  $show: boolean;
}

const CameraModeList = styled.div<CameraModeListProps>`
  display: flex;
  flex: ${(p) => (p.$show ? '1' : '0')};
  overflow: hidden;
  flex-direction: row;
  background: ${(p) => p.theme.SubLayerBackground};
  transition: flex 0.3s;
  border-radius: 2px;
`;

const PreviewLink = styled(Link)`
  pointer-events: all;
`;

const ThumbPreview = styled.img`
  font-size: ${(p) => p.theme.FontSize.m};
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

export interface ModeToolbarProps {
  status: RaspiStatus;
  control: ControlSettingDesc;
  isFullscreen: boolean;
  updateControl: (data: ControlSetting) => void;
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

export const ModeToolbar: React.FC<ModeToolbarProps> = ({
  status,
  control,
  isFullscreen,
  updateControl,
  setFullscreen,
}) => {
  const [showMode, setShowMode] = React.useState(false);

  return (
    <ModeToolbarContainer>
      {status.latestFile && (
        <PreviewLink to="/gallery">
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
        <CameraModeList $show={showMode}>
          {Object.entries(cameraModes).map(([mode, value]) => (
            <ToolbarButton
              key={mode}
              type={value.icon}
              onClick={() => {
                updateControl({ mode: mode as RaspiMode });
                setShowMode(false);
              }}
            />
          ))}
        </CameraModeList>
        <ToolbarButton
          type={cameraModes[control.mode.value || 'Photo'].icon}
          onClick={() => setShowMode(!showMode)}
        />
      </CameraModeDropdown>

      {!isFullscreen && <ToolbarButton type="Fullscreen" onClick={() => setFullscreen()} />}
    </ModeToolbarContainer>
  );
};
