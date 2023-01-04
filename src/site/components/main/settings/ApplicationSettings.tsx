import React from 'react';
import {
  ApplicationSetting,
  ApplicationSettingDesc,
} from '../../../../shared/settings/application';
import { EnumDropdownSetting } from './common/EnumDropdownSetting';
import { updateTypedField } from './common/helperFunctions';
import { SettingsExpander, SettingsExpanderHeader } from './common/SettingsExpander';
import { SettingsHeader, SettingsHeaderText, SettingsWrapper } from './common/Styled';

export interface ApplicationSettingsProps {
  data: ApplicationSettingDesc;
  updateData: (data: ApplicationSetting) => void;
}

export const ApplicationSettings: React.FC<ApplicationSettingsProps> = ({ data, updateData }) => {
  const updateField = updateTypedField(updateData);

  return (
    <SettingsWrapper>
      <SettingsHeader fontSize="m">
        <SettingsHeaderText>Application</SettingsHeaderText>
      </SettingsHeader>

      <SettingsExpander header={<SettingsExpanderHeader>General</SettingsExpanderHeader>}>
        <EnumDropdownSetting {...data.theme} update={updateField('theme')} />
      </SettingsExpander>
    </SettingsWrapper>
  );
};
