import React from 'react';
import { PhotoSetting, PhotoSettingDesc } from '../../../../shared/settings/photo';
import { BooleanSetting } from './common/BooleanSetting';
import { EnumDropdownSetting } from './common/EnumDropdownSetting';
import { EnumSlider } from './common/EnumSlider';
import { restoreSettings, updateTypedField } from './common/helperFunctions';
import { NumberSetting } from './common/NumberSetting';
import { SettingsExpander } from './common/SettingsExpander';
import {
  SettingsHeader,
  SettingsHeaderText,
  SettingsRestoreButton,
  SettingsWrapper,
} from './common/Styled';
import { TimeSetting } from './common/TimeSetting';

const photoResolutionPresets = [
  { name: '0.3 MP', width: 640, height: 480 },
  { name: '2 MP', width: 1600, height: 1200 },
  { name: '2.07 MP', width: 1920, height: 1080 },
  { name: '5 MP', width: 2560, height: 1920 },
  { name: '8 MP', width: 3264, height: 2448 },
  { name: '8.6 MP', width: 3840, height: 2160 },
  { name: '12.3 MP', width: 4056, height: 3040 },
];

const photoTimeoutPresets = [
  { name: '100 ms', value: 100 },
  { name: '500 ms', value: 500 },
  { name: '1 s', value: 1000 },
  { name: '2 s', value: 1000 * 2 },
  { name: '5 s', value: 1000 * 5 },
  { name: '10 s', value: 1000 * 10 },
  { name: '20 s', value: 1000 * 20 },
];

const qualityPresets = [
  { name: 'low', value: 60 },
  { name: 'medium', value: 80 },
  { name: 'high', value: 100 },
];

const timelapsePresets = [
  { name: 'off', value: undefined },
  { name: '3 sec', value: 3 * 1000 },
  { name: '10 sec', value: 10 * 1000 },
  { name: '1 min', value: 60 * 1000 },
  { name: '5 min', value: 5 * 60 * 1000 },
  { name: '10 min', value: 10 * 60 * 1000 },
];

export interface PhotoSettingsProps {
  data: PhotoSettingDesc;
  updateData: (data: PhotoSetting) => void;
}

export const TimelapseSetting: React.FC<PhotoSettingsProps> = ({ data, updateData }) => (
  <EnumSlider
    name="Timelapse"
    items={timelapsePresets}
    predicate={(x) => x.value === data.timelapse.value}
    displayValue={(x) => x.name}
    update={(x) => updateData({ timelapse: x.value })}
  />
);

export const FilterSetting: React.FC<PhotoSettingsProps> = ({ data, updateData }) => (
  <EnumSlider
    name="Timelapse"
    items={timelapsePresets}
    predicate={(x) => x.value === data.timelapse.value}
    displayValue={(x) => x.name}
    update={(x) => updateData({ timelapse: x.value })}
  />
);

export const PhotoSettings: React.FC<PhotoSettingsProps> = ({ data, updateData }) => {
  const updateField = updateTypedField(updateData);

  return (
    <SettingsWrapper>
      <SettingsHeader fontSize="m">
        <SettingsHeaderText>Photo</SettingsHeaderText>
        <SettingsRestoreButton
          type="SettingsRestore"
          onClick={() => updateData(restoreSettings(data))}
        />
      </SettingsHeader>

      <EnumSlider
        name={data.timeout.name}
        items={photoTimeoutPresets}
        displayValue={(x) => x.name}
        predicate={(x) => x.value === data.timeout.value}
        update={(x) => updateField('timeout')(x.value)}
      />

      <SettingsExpander
        header={
          <EnumSlider
            name="Resolution"
            items={photoResolutionPresets}
            displayValue={(x) => x.name}
            predicate={(x) => x.width === data.width.value && x.height === data.height.value}
            update={(x) => updateData({ width: x.width, height: x.height })}
          />
        }
      >
        <NumberSetting {...data.width} update={updateField('width')} />
        <NumberSetting {...data.height} update={updateField('height')} />
      </SettingsExpander>

      <SettingsExpander
        header={
          <EnumSlider
            name="Quality"
            items={qualityPresets}
            displayValue={(x) => x.name}
            predicate={(x) => x.value === data.quality.value}
            update={(x) => updateData({ quality: x.value })}
          />
        }
      >
        <NumberSetting {...data.quality} update={updateField('quality')} />
        <EnumDropdownSetting {...data.encoding} update={updateField('encoding')} />
        <BooleanSetting {...data.raw} update={updateField('raw')} />
      </SettingsExpander>

      <SettingsExpander header={<TimelapseSetting data={data} updateData={updateData} />}>
        <TimeSetting {...data.timelapse} update={updateField('timelapse')} />
        <TimeSetting {...data.timelapseTimeout} update={updateField('timelapseTimeout')} />
      </SettingsExpander>
    </SettingsWrapper>
  );
};
