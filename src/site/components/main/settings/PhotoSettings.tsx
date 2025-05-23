import React from 'react';
import { PhotoSetting, PhotoSettingDesc } from '../../../../shared/settings/photo.js';
import { BooleanSetting } from './common/BooleanSetting.js';
import { EnumDropdownSetting } from './common/EnumDropdownSetting.js';
import { EnumSlider } from './common/EnumSlider.js';
import { restoreSettings, updateTypedField } from './common/helperFunctions.js';
import { NumberSetting } from './common/NumberSetting.js';
import { SettingsExpander } from './common/SettingsExpander.js';
import { SettingsRestore } from './common/SettingsRestore.js';
import { SettingsHeader, SettingsHeaderText, SettingsWrapper } from './common/Styled.js';

const photoResolutionPresets = [
  { name: '0.3 MP', width: 640, height: 480 },
  { name: '2 MP', width: 1600, height: 1200 },
  { name: '2.07 MP', width: 1920, height: 1080 },
  { name: '5 MP', width: 2560, height: 1920 },
  { name: '8 MP', width: 3264, height: 2448 },
  { name: '8.6 MP', width: 3840, height: 2160 },
  { name: '12.3 MP', width: 4056, height: 3040 },
  { name: '20.2 MP', width: 5496, height: 3672 },
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

export interface PhotoSettingsProps {
  photo: PhotoSettingDesc;
  updatePhoto: (data: PhotoSetting) => void;
}

export const PhotoSettings: React.FC<PhotoSettingsProps> = ({ photo, updatePhoto }) => {
  const updateField = updateTypedField(updatePhoto);

  return (
    <SettingsWrapper>
      <SettingsHeader fontSize="m">
        <SettingsHeaderText>Photo</SettingsHeaderText>
        <SettingsRestore name="Photo" updateSettings={() => updatePhoto(restoreSettings(photo))} />
      </SettingsHeader>

      <EnumSlider
        name={photo.timeout.name}
        items={photoTimeoutPresets}
        displayValue={(x) => x.name}
        predicate={(x) => x.value === photo.timeout.value}
        update={(x) => updateField('timeout')(x.value)}
      />

      <SettingsExpander
        header={
          <EnumSlider
            name="Resolution"
            items={photoResolutionPresets}
            displayValue={(x) => x.name}
            predicate={(x) => x.width === photo.width.value && x.height === photo.height.value}
            update={(x) => updatePhoto({ width: x.width, height: x.height })}
          />
        }
      >
        <NumberSetting {...photo.width} update={updateField('width')} />
        <NumberSetting {...photo.height} update={updateField('height')} />
      </SettingsExpander>

      <SettingsExpander
        header={
          <EnumSlider
            name="Quality"
            items={qualityPresets}
            displayValue={(x) => x.name}
            predicate={(x) => x.value === photo.quality.value}
            update={(x) => updatePhoto({ quality: x.value })}
          />
        }
      >
        <NumberSetting {...photo.quality} update={updateField('quality')} />
        <EnumDropdownSetting {...photo.encoding} update={updateField('encoding')} />
        <BooleanSetting {...photo.raw} update={updateField('raw')} />
        <BooleanSetting
          {...photo['autofocus-on-capture']}
          update={updateField('autofocus-on-capture')}
        />
      </SettingsExpander>
    </SettingsWrapper>
  );
};
