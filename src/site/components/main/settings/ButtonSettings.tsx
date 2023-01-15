import React from 'react';
import { ButtonSetting, ButtonSettingDesc } from '../../../../shared/settings/button.js';
import { EnumDropdownSetting } from './common/EnumDropdownSetting.js';
import { restoreSettings, updateTypedField } from './common/helperFunctions.js';
import { NumberSetting } from './common/NumberSetting.js';
import { SettingsExpander } from './common/SettingsExpander.js';
import {
  SettingsHeader,
  SettingsHeaderText,
  SettingsRestoreButton,
  SettingsWrapper,
} from './common/Styled.js';

export interface ButtonSettingsProps {
  button: ButtonSettingDesc;
  updateButton: (data: ButtonSetting) => void;
}

export const ButtonSettings: React.FC<ButtonSettingsProps> = ({ button, updateButton }) => {
  const updateField = updateTypedField(updateButton);

  return (
    <SettingsWrapper>
      <SettingsHeader fontSize="m">
        <SettingsHeaderText>GPIO</SettingsHeaderText>
        <SettingsRestoreButton
          type="SettingsRestore"
          onClick={() => updateButton(restoreSettings(button))}
        />
      </SettingsHeader>

      <SettingsExpander
        header={<EnumDropdownSetting {...button.gpioPin} update={updateField('gpioPin')} />}
      >
        <EnumDropdownSetting {...button.edge} update={updateField('edge')} />
        <NumberSetting {...button.debounceTimeout} update={updateField('debounceTimeout')} />
      </SettingsExpander>
    </SettingsWrapper>
  );
};
