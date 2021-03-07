import React from 'react';
import { SettingVerticalWrapper, SettingNameValueContainer, SettingName, SettingValue } from '.';
import { isDefined } from '../../../../shared/helperFunctions';
import { NumberTypeSetting } from '../../../../shared/settings';
import { Slider } from '../../styled/Slider';

export interface NumberSettingProps extends NumberTypeSetting {
  update: (value: number) => void;
}

export const NumberSetting: React.FC<NumberSettingProps> = ({
  name,
  value,
  defaultValue,
  minValue,
  maxValue,
  stepValue,
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
        value={displayValue || 0}
        min={minValue}
        max={maxValue}
        step={stepValue}
        onChange={(e) => update(e.target.valueAsNumber)}
      />
    </SettingVerticalWrapper>
  );
};
