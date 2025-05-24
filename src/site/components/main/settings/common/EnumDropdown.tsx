import React from 'react';
import { isDefined } from '../../../../../shared/helperFunctions.js';
import { Select } from '../../../styled/Select.js';
import { SettingHorizontalWrapper, SettingName } from './Styled.js';

export type EnumDropdownValueType = string | number;

export interface EnumEntryType<T extends EnumDropdownValueType> {
  name: string;
  value: T;
}

export interface EnumDropdownProps<T extends EnumDropdownValueType> {
  name: string;
  value?: T;
  defaultValue?: T;
  items: EnumEntryType<T>[];
  update: (value: string) => void;
}

export const EnumDropdown = <T extends EnumDropdownValueType>({
  name,
  value,
  defaultValue,
  items,
  update,
}: EnumDropdownProps<T>) => (
  <SettingHorizontalWrapper>
    <SettingName fontSize="s">{name}</SettingName>
    <Select
      value={isDefined(value) ? value : defaultValue}
      onChange={(e) => update(e.target.value)}
    >
      {items.map(({ name, value }) => (
        <option key={name} value={value}>
          {name}
        </option>
      ))}
    </Select>
  </SettingHorizontalWrapper>
);
