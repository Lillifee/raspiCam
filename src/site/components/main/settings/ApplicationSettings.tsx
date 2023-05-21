import React from 'react';
import {
  ApplicationSetting,
  ApplicationSettingDesc,
} from '../../../../shared/settings/application.js';
import { BooleanSetting } from './common/BooleanSetting.js';
import { EnumDropdownSetting } from './common/EnumDropdownSetting.js';
import { updateTypedField } from './common/helperFunctions.js';
import {
  SettingHorizontalWrapper,
  SettingName,
  SettingsHeader,
  SettingsHeaderText,
  SettingsWrapper,
  SettingValue,
} from './common/Styled.js';
import { version } from '../../../../../package.json';

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

      <EnumDropdownSetting {...application.theme} update={updateField('theme')} />
      <EnumDropdownSetting {...application.gridLines} update={updateField('gridLines')} />
      <BooleanSetting {...application.playerStats} update={updateField('playerStats')} />

      <SettingHorizontalWrapper>
        <SettingName fontSize="s">Version</SettingName>
        <SettingValue fontSize="s">{version}</SettingValue>
      </SettingHorizontalWrapper>
    </SettingsWrapper>
  );
};
