import React from 'react';
import { Slider } from '../../../styled/Slider';
import {
  SettingName,
  SettingNameValueContainer,
  SettingValue,
  SettingVerticalWrapper,
} from './Styled';

export interface EnumSlider<T> {
  name: string;
  items: T[];
  predicate: (item: T) => boolean;
  displayValue: (item: T) => React.ReactNode;
  update: (item: T) => void;
}

export const EnumSlider = <T,>({
  name,
  items,
  predicate,
  displayValue,
  update,
}: EnumSlider<T>): JSX.Element => {
  const index = items.findIndex(predicate);

  return (
    <SettingVerticalWrapper>
      <SettingNameValueContainer>
        <SettingName fontSize="s">{name}</SettingName>
        <SettingValue fontSize="s">{index >= 0 && displayValue(items[index])}</SettingValue>
      </SettingNameValueContainer>

      <Slider
        value={index}
        unset={index < 0}
        max={items.length - 1}
        onChange={(e) => update(items[e.target.valueAsNumber])}
      />
    </SettingVerticalWrapper>
  );
};
