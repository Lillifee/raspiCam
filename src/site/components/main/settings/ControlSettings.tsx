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
  data: ControlSettingDesc;
  updateData: (data: ControlSetting) => void;
}

export const ControlSettings: React.FC<ControlSettingsProps> = ({ data, updateData }) => {
  const updateField = updateTypedField(updateData);

  return (
    <SettingsWrapper>
      <SettingsHeader fontSize="m">
        <SettingsHeaderText>Control</SettingsHeaderText>
        <SettingsRestoreButton
          type="SettingsRestore"
          onClick={() => updateData(restoreSettings(data))}
        />
      </SettingsHeader>

      <EnumDropdownSetting {...data.mode} update={updateField('mode')} />
      <BooleanSetting {...data.captureStartup} update={updateField('captureStartup')} />
    </SettingsWrapper>
  );
};
