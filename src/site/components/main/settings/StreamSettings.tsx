import React from 'react';
import {
  ApplicationSetting,
  ApplicationSettingDesc,
} from '../../../../shared/settings/application.js';
import { StreamSetting, StreamSettingDesc } from '../../../../shared/settings/stream.js';
import { EnumDropdownSetting } from './common/EnumDropdownSetting.js';
import { EnumSlider } from './common/EnumSlider.js';
import { restoreSettings, updateTypedField } from './common/helperFunctions.js';
import { NumberSetting } from './common/NumberSetting.js';
import { SettingsExpander } from './common/SettingsExpander.js';
import { SettingsRestore } from './common/SettingsRestore.js';
import { SettingsHeader, SettingsHeaderText, SettingsWrapper } from './common/Styled.js';

const streamResolutionPresets = [
  { name: '240p', width: 426, height: 240 },
  { name: '360p', width: 640, height: 360 },
  { name: '480p', width: 854, height: 480 },
  { name: '720p', width: 1280, height: 720 },
  { name: '1080p', width: 1920, height: 1080 },
  { name: '1640x1232', width: 1640, height: 1232 },
];

export interface StreamSettingsProps {
  stream: StreamSettingDesc;
  application: ApplicationSettingDesc;
  updateStream: (data: StreamSetting) => void;
  updateApplication: (app: ApplicationSetting) => void;
}

export const StreamSettings: React.FC<StreamSettingsProps> = ({
  stream,
  application,
  updateStream,
  updateApplication,
}) => {
  const updateStreamField = updateTypedField(updateStream);
  const updateApplicationField = updateTypedField(updateApplication);

  return (
    <SettingsWrapper>
      <SettingsHeader fontSize="m">
        <SettingsHeaderText>Stream</SettingsHeaderText>
        <SettingsRestore
          name="Stream"
          updateSettings={() => updateStream(restoreSettings(stream))}
        />
      </SettingsHeader>

      <SettingsExpander
        header={
          <EnumSlider
            name="Resolution"
            items={streamResolutionPresets}
            predicate={(x) => x.width === stream.width.value && x.height === stream.height.value}
            displayValue={(x) => x.name}
            update={(x) => updateStream({ width: x.width, height: x.height })}
          />
        }
      >
        <NumberSetting {...stream.width} update={updateStreamField('width')} />
        <NumberSetting {...stream.height} update={updateStreamField('height')} />
        <NumberSetting {...stream.framerate} update={updateStreamField('framerate')} />
      </SettingsExpander>

      <SettingsExpander
        header={<EnumDropdownSetting {...stream.codec} update={updateStreamField('codec')} />}
      >
        {stream.codec.value === 'H264' && (
          <React.Fragment>
            <EnumDropdownSetting
              {...application.player}
              update={updateApplicationField('player')}
            />
            <NumberSetting {...stream.bitrate} update={updateStreamField('bitrate')} />
            <EnumDropdownSetting {...stream.profile} update={updateStreamField('profile')} />
            <EnumDropdownSetting {...stream.level} update={updateStreamField('level')} />
          </React.Fragment>
        )}
        {stream.codec.value === 'MJPEG' && (
          <NumberSetting {...stream.quality} update={updateStreamField('quality')} />
        )}
      </SettingsExpander>
    </SettingsWrapper>
  );
};
