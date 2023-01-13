import React from 'react';
import {
  ApplicationSetting,
  ApplicationSettingDesc,
} from '../../../../shared/settings/application';
import { StreamSetting, StreamSettingDesc } from '../../../../shared/settings/stream';
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

const videoResolutionPresets = [
  { name: '240p', width: 426, height: 240 },
  { name: '360p', width: 640, height: 360 },
  { name: '480p', width: 854, height: 480 },
  { name: '720p', width: 1280, height: 720 },
  { name: '1080p', width: 1920, height: 1080 },
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
        <SettingsRestoreButton
          type="SettingsRestore"
          onClick={() => updateStream(restoreSettings(stream))}
        />
      </SettingsHeader>

      <SettingsExpander
        header={
          <EnumSlider
            name="Resolution"
            items={videoResolutionPresets}
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
            <NumberSetting {...stream.bitrate} update={updateStreamField('bitrate')} />
            <EnumDropdownSetting
              {...application.player}
              update={updateApplicationField('player')}
            />
          </React.Fragment>
        )}
        {stream.codec.value === 'MJPEG' && (
          <NumberSetting {...stream.quality} update={updateStreamField('quality')} />
        )}
      </SettingsExpander>
    </SettingsWrapper>
  );
};
