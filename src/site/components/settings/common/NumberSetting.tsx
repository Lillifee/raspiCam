import React from 'react';
import { SettingVerticalWrapper, SettingNameValueContainer, SettingName, SettingValue } from '.';
import { isDefined } from '../../../../shared/helperFunctions';
import { NumberTypeSetting } from '../../../../shared/settings';
import { Slider } from '../../styled/Slider';

export interface NumberSettingProps extends NumberTypeSetting {
  disabled?: boolean;
  update: (value: number) => void;
}

export const NumberSetting: React.FC<NumberSettingProps> = ({
  name,
  value,
  defaultValue,
  minValue,
  maxValue,
  stepValue,
  disabled,
  format,
  update,
}) => {
  const displayValue = isDefined(value) ? value : defaultValue;
  return (
    <SettingVerticalWrapper>
      <SettingNameValueContainer>
        <SettingName fontSize="s">{name}</SettingName>
        <SettingValue fontSize="s">{format(displayValue)}</SettingValue>
      </SettingNameValueContainer>

      <Slider
        value={displayValue}
        min={minValue}
        max={maxValue}
        step={stepValue}
        disabled={disabled}
        onChange={(e) => update(parseFloat(e.target.value))}
      />
    </SettingVerticalWrapper>
  );
};
