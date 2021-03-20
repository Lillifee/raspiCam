import React from 'react';
import { isDefined } from '../../../../../shared/helperFunctions';
import { NumberTypeSetting } from '../../../../../shared/settings/types';
import { Slider } from '../../../styled/Slider';
import {
  SettingVerticalWrapper,
  SettingNameValueContainer,
  SettingName,
  SettingValue,
} from './Styled';

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
