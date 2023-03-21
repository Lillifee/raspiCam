import React from 'react';
import { ControlSetting, ControlSettingDesc } from '../../../../shared/settings/control.js';
import { BooleanSetting } from './common/BooleanSetting.js';
import { EnumDropdownSetting } from './common/EnumDropdownSetting.js';
import { restoreSettings, updateTypedField } from './common/helperFunctions.js';
import { SettingsRestore } from './common/SettingsRestore.js';
import { SettingsHeader, SettingsHeaderText, SettingsWrapper } from './common/Styled.js';

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
        <SettingsRestore
          name="Control"
          updateSettings={() => updateControl(restoreSettings(control))}
        />
      </SettingsHeader>

      <EnumDropdownSetting {...control.mode} update={updateField('mode')} />
      <BooleanSetting {...control.captureStartup} update={updateField('captureStartup')} />
    </SettingsWrapper>
  );
};
