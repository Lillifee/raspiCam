import React from 'react';
import { TimelapseSetting, TimelapseSettingDesc } from '../../../../shared/settings/timelapse.js';
import { RaspiStatus } from '../../../../shared/settings/types.js';
import { Label, SubLabel } from '../../styled/Label.js';
import { Link } from '../../styled/Link.js';
import { BooleanSetting } from './common/BooleanSetting.js';
import { EnumSlider } from './common/EnumSlider.js';
import { restoreSettings, updateTypedField } from './common/helperFunctions.js';
import { SettingsExpander } from './common/SettingsExpander.js';
import { SettingsRestore } from './common/SettingsRestore.js';
import { StringSetting } from './common/StringSetting.js';
import {
  SettingsHeader,
  SettingsHeaderText,
  SettingsWrapper,
  SettingVerticalWrapper,
} from './common/Styled.js';

export interface TimelapseSliderProps {
  timelapse: TimelapseSettingDesc;
  updateTimelapse: (data: TimelapseSetting) => void;
}

const timelapsePresets = [
  { name: '10 sec', value: '*/10 * * * * *' },
  { name: '1 min', value: '* * * * *' },
  { name: '5 min', value: '*/5 * * * *' },
  { name: '10 min', value: '*/10 * * * *' },
  { name: '1 hour', value: '0 * * * *' },
];

export interface TimelapseSettingsProps {
  status: RaspiStatus;
  timelapse: TimelapseSettingDesc;
  updateTimelapse: (data: TimelapseSetting) => void;
}

export const TimelapseSettings: React.FC<TimelapseSettingsProps> = ({
  status,
  timelapse,
  updateTimelapse,
}) => {
  const updateField = updateTypedField(updateTimelapse);

  return (
    <SettingsWrapper>
      <SettingsHeader fontSize="m">
        <SettingsHeaderText>Timelapse</SettingsHeaderText>
        <SettingsRestore
          name="Timelapse"
          updateSettings={() => updateTimelapse(restoreSettings(timelapse))}
        />
      </SettingsHeader>

      <BooleanSetting {...timelapse.enabled} update={updateField('enabled')} />

      {timelapse.enabled.value && status.timelapse?.running && (
        <SettingsExpander
          header={
            <EnumSlider
              name="Timelapse"
              items={timelapsePresets}
              predicate={(x) => x.value === timelapse.schedule.value}
              displayValue={(x) => x.name}
              update={(x) => updateTimelapse({ schedule: x.value })}
            />
          }
        >
          <SettingVerticalWrapper>
            <SubLabel fontSize="s">
              To find additional details and examples regarding the cron syntax, please refer to{' '}
              <Link href="https://crontab.guru/" target="_blank" rel="noreferrer">
                crontab.guru
              </Link>
            </SubLabel>

            <StringSetting {...timelapse.schedule} update={updateField('schedule')} />

            <Label fontSize="s">Next capture {status.timelapse?.nextDate}</Label>
            {status.timelapse?.nextDates.length > 0 && (
              <React.Fragment>
                {status.timelapse?.nextDates.map((date, i) => (
                  <SubLabel key={`${date}${i}`} fontSize="s">
                    {date}
                  </SubLabel>
                ))}
                <SubLabel fontSize="s">...</SubLabel>
              </React.Fragment>
            )}
          </SettingVerticalWrapper>
        </SettingsExpander>
      )}
    </SettingsWrapper>
  );
};
