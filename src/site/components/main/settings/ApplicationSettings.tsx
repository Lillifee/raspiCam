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
