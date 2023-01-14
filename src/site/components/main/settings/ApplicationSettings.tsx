import React from 'react';
import {
  ApplicationSetting,
  ApplicationSettingDesc,
} from '../../../../shared/settings/application.js';
import { EnumDropdownSetting } from './common/EnumDropdownSetting.js';
import { updateTypedField } from './common/helperFunctions.js';
import { SettingsExpander, SettingsExpanderHeader } from './common/SettingsExpander.js';
import { SettingsHeader, SettingsHeaderText, SettingsWrapper } from './common/Styled.js';

export interface ApplicationSettingsProps {
  application: ApplicationSettingDesc;
  updateApplication: (data: ApplicationSetting) => void;
}

export const ApplicationSettings: React.FC<ApplicationSettingsProps> = ({
  application,
  updateApplication,
}) => {
  const updateField = updateTypedField(updateApplication);

  return (
    <SettingsWrapper>
      <SettingsHeader fontSize="m">
        <SettingsHeaderText>Application</SettingsHeaderText>
      </SettingsHeader>

      <SettingsExpander header={<SettingsExpanderHeader>General</SettingsExpanderHeader>}>
        <EnumDropdownSetting {...application.theme} update={updateField('theme')} />
        <EnumDropdownSetting {...application.gridLines} update={updateField('gridLines')} />
      </SettingsExpander>
    </SettingsWrapper>
  );
};
