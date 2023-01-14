import * as React from 'react';
import { styled } from 'styled-components';
import { ControlSettingDesc } from '../../../shared/settings/control.js';
import { IconType } from '../common/Icon.js';
import { ButtonIcon } from '../styled/ButtonIcon.js';
import { ActiveSetting } from './Camera.js';

//#region styled

const ToolbarContainer = styled.div`
  display: flex;
  flex-direction: row;
  backdrop-filter: blur(5px);
  background-color: ${(p) => p.theme.LayerBackground};
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

const Button = styled(ButtonIcon)`
  padding: 0.8em;
`;

//#endregion

interface ToolbarButtonProps {
  icon: IconType;
  setting: ActiveSetting;
  active: ActiveSetting;
  activate: (setting: ActiveSetting) => void;
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({ icon, setting, activate }) => (
  <Button type={icon} onClick={() => activate(setting)} />
);

export interface ToolbarProps {
  control: ControlSettingDesc;
  active: ActiveSetting;
  activate: (setting: ActiveSetting) => void;
}

export const SettingsToolbar: React.FC<ToolbarProps> = ({ control, active, activate }) => (
  <ToolbarContainer>
    <ToolbarButton icon="Tune" setting="Settings" active={active} activate={activate} />
    <ToolbarButton icon="Exposure" setting="Exposure" active={active} activate={activate} />
    <ToolbarButton icon="WbAuto" setting="AwbAuto" active={active} activate={activate} />

    {control.mode.value === 'Photo' && (
      <React.Fragment>
        <ToolbarButton icon="ShutterSpeed" setting="Shutter" active={active} activate={activate} />
        <ToolbarButton icon="Timelapse" setting="Timelapse" active={active} activate={activate} />
      </React.Fragment>
    )}
  </ToolbarContainer>
);
