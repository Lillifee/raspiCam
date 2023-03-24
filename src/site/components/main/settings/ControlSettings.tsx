import React from 'react';
import styled from 'styled-components';
import { fileNameFormatter } from '../../../../shared/helperFunctions.js';
import { ControlSetting, ControlSettingDesc } from '../../../../shared/settings/control.js';
import { SubLabel } from '../../styled/Label.js';
import { BooleanSetting } from './common/BooleanSetting.js';
import { EnumDropdownSetting } from './common/EnumDropdownSetting.js';
import { restoreSettings, updateTypedField } from './common/helperFunctions.js';
import { SettingsRestore } from './common/SettingsRestore.js';
import { SettingsHeader, SettingsHeaderText, SettingsWrapper } from './common/Styled.js';

export const FileExampleLabel = styled(SubLabel)`
  align-self: flex-end;
`;

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

      <BooleanSetting {...control.captureStartup} update={updateField('captureStartup')} />
      <EnumDropdownSetting {...control.mode} update={updateField('mode')} />
      <EnumDropdownSetting {...control.fileName} update={updateField('fileName')} />
      <FileExampleLabel fontSize="s">
        {fileNameFormatter[control.fileName.value || 'ISO Date time']()}.jpg
      </FileExampleLabel>
    </SettingsWrapper>
  );
};
