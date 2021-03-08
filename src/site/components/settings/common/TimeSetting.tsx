import React from 'react';
import { isDefined } from '../../../../shared/helperFunctions';
import { NumberTypeSetting } from '../../../../shared/settings/types';
import { Time } from '../../styled/Time';
import { SettingName, SettingHorizontalWrapper } from './Styled';

export interface TimeSettingProps extends NumberTypeSetting {
  update: (value: number) => void;
}

export const TimeSetting: React.FC<TimeSettingProps> = ({ name, value, update }) => {
  const date = new Date(0);
  date.setSeconds(isDefined(value) ? value / 1000 : 0);
  const time = date.toISOString().substr(11, 8);

  return (
    <SettingHorizontalWrapper>
      <SettingName fontSize="s">{name}</SettingName>
      <Time step="1" value={time} onChange={(e) => update(e.target.valueAsNumber)} />
    </SettingHorizontalWrapper>
  );
};
