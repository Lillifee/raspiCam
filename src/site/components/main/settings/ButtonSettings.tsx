import React from 'react';
import { ButtonSetting, ButtonSettingDesc } from '../../../../shared/settings/button.js';
import { RaspiStatus } from '../../../../shared/settings/types.js';
import { Label, SubLabel } from '../../styled/Label.js';
import { EnumDropdownSetting } from './common/EnumDropdownSetting.js';
import { restoreSettings, updateTypedField } from './common/helperFunctions.js';
import { NumberSetting } from './common/NumberSetting.js';
import { SettingsExpander } from './common/SettingsExpander.js';
import { SettingsRestore } from './common/SettingsRestore.js';
import { SettingsHeader, SettingsHeaderText, SettingsWrapper } from './common/Styled.js';
import { BooleanSetting } from './common/BooleanSetting.js';

export interface ButtonSettingsProps {
  status: RaspiStatus;
  button: ButtonSettingDesc;
  updateButton: (data: ButtonSetting) => void;
}

export const ButtonSettings: React.FC<ButtonSettingsProps> = ({ status, button, updateButton }) => {
  const updateField = updateTypedField(updateButton);

  return (
    <SettingsWrapper>
      <SettingsHeader fontSize="m">
        <SettingsHeaderText>GPIO</SettingsHeaderText>
        <SettingsRestore name="GPIO" updateSettings={() => updateButton(restoreSettings(button))} />
      </SettingsHeader>

      {status.gpioAvailable ? (
        <SettingsExpander
          header={<EnumDropdownSetting {...button.gpioPin} update={updateField('gpioPin')} />}
        >
          <EnumDropdownSetting {...button.edge} update={updateField('edge')} />
          <NumberSetting {...button.debounceTimeout} update={updateField('debounceTimeout')} />
          <NumberSetting {...button.lockoutTime} update={updateField('lockoutTime')} />
          <BooleanSetting
            {...button.stopCaptureOnTrigger}
            update={updateField('stopCaptureOnTrigger')}
          />
        </SettingsExpander>
      ) : (
        <React.Fragment>
          <Label fontSize="m">GPIO is not available.</Label>
          <SubLabel fontSize="s">
            Install the onoff library on your raspberry pi using &apos;npm install onoff&apos;
          </SubLabel>
        </React.Fragment>
      )}
    </SettingsWrapper>
  );
};
