import React from 'react';
import { ControlSetting, ControlSettingDesc } from '../../../../shared/settings/control';
import { BooleanSetting } from './common/BooleanSetting';
import { EnumDropdownSetting } from './common/EnumDropdownSetting';
import { restoreSettings, updateTypedField } from './common/helperFunctions';
import {
  SettingsHeader,
  SettingsHeaderText,
  SettingsRestoreButton,
  SettingsWrapper,
} from './common/Styled';

export interface ControlSettingsProps {
  control: ControlSettingDesc;
  updateControl: (data: ControlSetting) => void;
}

export const ControlSettings: React.FC<ControlSettingsProps> = ({ control, updateControl }) => {
  const updateField = updateTypedField(updateControl);

  return (
    <SettingsWrapper>
      <SettingsHeader fontSize="m">
        <SettingsHeaderText>Control</SettingsHeaderText>
        <SettingsRestoreButton
          type="SettingsRestore"
          onClick={() => updateControl(restoreSettings(control))}
        />
      </SettingsHeader>

      <EnumDropdownSetting {...control.mode} update={updateField('mode')} />
      <BooleanSetting {...control.captureStartup} update={updateField('captureStartup')} />
    </SettingsWrapper>
  );
};
