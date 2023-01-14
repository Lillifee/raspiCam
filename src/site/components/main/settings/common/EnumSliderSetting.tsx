import React from 'react';
import { EnumTypeSetting } from '../../../../../shared/settings/types.js';
import { Slider } from '../../../styled/Slider.js';
import {
  SettingName,
  SettingNameValueContainer,
  SettingValue,
  SettingVerticalWrapper,
} from './Styled.js';

export interface EnumSliderSettingProps<T> extends EnumTypeSetting<T> {
  disabled?: boolean;
  update: (value?: T) => void;
}

export const EnumSliderSetting = <T extends string>({
  name,
  value,
  defaultValue,
  possibleValues,
  disabled,
  format,
  update,
}: EnumSliderSettingProps<T>) => {
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
        $unset={displayIndex < 0}
        max={possibleValues.length - 1}
        onChange={(e) => update(possibleValues[e.target.valueAsNumber])}
      />
    </SettingVerticalWrapper>
  );
};
