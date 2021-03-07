import React from 'react';
import { EnumTypeSetting } from '../../../../shared/settings/types';
import { Slider } from '../../styled/Slider';
import {
  SettingVerticalWrapper,
  SettingNameValueContainer,
  SettingName,
  SettingValue,
} from './Styled';

export interface EnumSliderSettingProps extends EnumTypeSetting {
  disabled?: boolean;
  update: (value?: string) => void;
}

export const EnumSliderSetting: React.FC<EnumSliderSettingProps> = ({
  name,
  value,
  defaultValue,
  possibleValues,
  disabled,
  format,
  update,
}) => {
  const index = possibleValues.findIndex((x) => x === value);
  const displayIndex = index >= 0 ? index : possibleValues.findIndex((x) => x === defaultValue);

  return (
    <SettingVerticalWrapper>
      <SettingNameValueContainer>
        <SettingName fontSize="s">{name}</SettingName>
        <SettingValue fontSize="s">
          {displayIndex >= 0 && format(possibleValues[displayIndex])}
        </SettingValue>
      </SettingNameValueContainer>

      <Slider
        disabled={disabled}
        value={displayIndex}
        unset={displayIndex < 0}
        max={possibleValues.length - 1}
        onChange={(e) => update(possibleValues[e.target.valueAsNumber])}
      />
    </SettingVerticalWrapper>
  );
};
