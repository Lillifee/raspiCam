import React from 'react';
import { Slider } from '../../../styled/Slider.js';
import {
  SettingName,
  SettingNameValueContainer,
  SettingValue,
  SettingVerticalWrapper,
} from './Styled.js';

export interface EnumSlider<T> {
  name: string;
  items: T[];
  predicate: (item: T) => boolean;
  displayValue: (item: T) => React.ReactNode;
  update: (item: T) => void;
}

export const EnumSlider = <T,>({ name, items, predicate, displayValue, update }: EnumSlider<T>) => {
  const index = items.findIndex(predicate);

  return (
    <SettingVerticalWrapper>
      <SettingNameValueContainer>
        <SettingName fontSize="s">{name}</SettingName>
        <SettingValue fontSize="s">{index >= 0 && displayValue(items[index])}</SettingValue>
      </SettingNameValueContainer>

      <Slider
        $unset={index < 0}
        value={index}
        max={items.length - 1}
        onChange={(e) => update(items[e.target.valueAsNumber])}
      />
    </SettingVerticalWrapper>
  );
};
