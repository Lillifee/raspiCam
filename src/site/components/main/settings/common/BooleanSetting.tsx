import React from 'react';
import { isDefined } from '../../../../../shared/helperFunctions.js';
import { BooleanTypeSetting } from '../../../../../shared/settings/types.js';
import { Toggle } from '../../../styled/Toggle.js';
import { SettingHorizontalWrapper, SettingName } from './Styled.js';

export interface BooleanSettingProps extends BooleanTypeSetting {
  update: (value: boolean) => void;
}

export const BooleanSetting: React.FC<BooleanSettingProps> = ({
  name,
  value,
  defaultValue,
  update,
}) => (
  <SettingHorizontalWrapper>
    <SettingName fontSize="s">{name}</SettingName>
    <Toggle checked={isDefined(value) ? value : defaultValue} onChange={() => update(!value)} />
  </SettingHorizontalWrapper>
);
