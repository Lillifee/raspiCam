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
import { EnumDropdown } from './common/EnumDropdown.js';

const gpioPinPresets = [
  { name: 'none', value: 0 },
  { name: 'gpio-512 (ID_SDA)', value: 512 },
  { name: 'gpio-513 (ID_SCL)', value: 513 },
  { name: 'gpio-514 (GPIO2)', value: 514 },
  { name: 'gpio-515 (GPIO3)', value: 515 },
  { name: 'gpio-516 (GPIO4)', value: 516 },
  { name: 'gpio-517 (GPIO5)', value: 517 },
  { name: 'gpio-518 (GPIO6)', value: 518 },
  { name: 'gpio-519 (GPIO7)', value: 519 },
  { name: 'gpio-520 (GPIO8)', value: 520 },
  { name: 'gpio-521 (GPIO9)', value: 521 },
  { name: 'gpio-522 (GPIO10)', value: 522 },
  { name: 'gpio-523 (GPIO11)', value: 523 },
  { name: 'gpio-524 (GPIO12)', value: 524 },
  { name: 'gpio-525 (GPIO13)', value: 525 },
  { name: 'gpio-526 (GPIO14)', value: 526 },
  { name: 'gpio-527 (GPIO15)', value: 527 },
  { name: 'gpio-528 (GPIO16)', value: 528 },
  { name: 'gpio-529 (GPIO17)', value: 529 },
  { name: 'gpio-530 (GPIO18)', value: 530 },
  { name: 'gpio-531 (GPIO19)', value: 531 },
  { name: 'gpio-532 (GPIO20)', value: 532 },
  { name: 'gpio-533 (GPIO21)', value: 533 },
  { name: 'gpio-534 (GPIO22)', value: 534 },
  { name: 'gpio-535 (GPIO23)', value: 535 },
  { name: 'gpio-536 (GPIO24)', value: 536 },
  { name: 'gpio-537 (GPIO25)', value: 537 },
  { name: 'gpio-538 (GPIO26)', value: 538 },
  { name: 'gpio-539 (GPIO27)', value: 539 },
  { name: 'gpio-540 (RGMII_MDIO)', value: 540 },
  { name: 'gpio-541 (RGMIO_MDC)', value: 541 },
  { name: 'gpio-542 (CTS0)', value: 542 },
  { name: 'gpio-543 (RTS0)', value: 543 },
  { name: 'gpio-544 (TXD0)', value: 544 },
  { name: 'gpio-545 (RXD0)', value: 545 },
  { name: 'gpio-546 (SD1_CLK)', value: 546 },
  { name: 'gpio-547 (SD1_CMD)', value: 547 },
  { name: 'gpio-548 (SD1_DATA0)', value: 548 },
  { name: 'gpio-549 (SD1_DATA1)', value: 549 },
  { name: 'gpio-550 (SD1_DATA2)', value: 550 },
  { name: 'gpio-551 (SD1_DATA3)', value: 551 },
  { name: 'gpio-552 (PWM0_MISO)', value: 552 },
  { name: 'gpio-553 (PWM1_MOSI)', value: 553 },
  { name: 'gpio-554 (STATUS_LED_G_CLK)', value: 554 },
  { name: 'gpio-555 (SPIFLASH_CE_N)', value: 555 },
  { name: 'gpio-556 (SDA0)', value: 556 },
  { name: 'gpio-557 (SCL0)', value: 557 },
  { name: 'gpio-558 (RGMII_RXCLK)', value: 558 },
  { name: 'gpio-559 (RGMII_RXCTL)', value: 559 },
  { name: 'gpio-560 (RGMII_RXD0)', value: 560 },
  { name: 'gpio-561 (RGMII_RXD1)', value: 561 },
  { name: 'gpio-562 (RGMII_RXD2)', value: 562 },
  { name: 'gpio-563 (RGMII_RXD3)', value: 563 },
  { name: 'gpio-564 (RGMII_TXCLK)', value: 564 },
  { name: 'gpio-565 (RGMII_TXCTL)', value: 565 },
  { name: 'gpio-566 (RGMII_TXD0)', value: 566 },
  { name: 'gpio-567 (RGMII_TXD1)', value: 567 },
  { name: 'gpio-568 (RGMII_TXD2)', value: 568 },
  { name: 'gpio-569 (RGMII_TXD3)', value: 569 },
];

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
          header={
            <EnumDropdown
              items={gpioPinPresets}
              name={button.gpioPin.name}
              value={button.gpioPin.value}
              update={(x) => updateField('gpioPin')(parseInt(x))}
            />
          }
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
