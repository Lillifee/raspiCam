import React from 'react';
import { PreviewSetting, PreviewSettingDesc } from '../../../../shared/settings/preview';
import { BooleanSetting } from './common/BooleanSetting';
import { updateTypedField, restoreSettings } from './common/helperFunctions';
import { NumberSetting } from './common/NumberSetting';
import { SettingsExpander, SettingsExpanderHeader } from './common/SettingsExpander';
import {
  SettingsWrapper,
  SettingsHeader,
  SettingsHeaderText,
  SettingsRestoreButton,
} from './common/Styled';

export interface PreviewSettingsProps {
  data: PreviewSettingDesc;
  updateData: (data: PreviewSetting) => void;
}

export const PreviewSettings: React.FC<PreviewSettingsProps> = ({ data, updateData }) => {
  const updateField = updateTypedField(updateData);

  return (
    <SettingsWrapper>
      <SettingsHeader fontSize="m">
        <SettingsHeaderText>Preview</SettingsHeaderText>
        <SettingsRestoreButton
          type="SettingsRestore"
          onClick={() => updateData(restoreSettings(data))}
        />
      </SettingsHeader>

      <SettingsExpander header={<SettingsExpanderHeader>HDMI Preview</SettingsExpanderHeader>}>
        <BooleanSetting {...data.nopreview} update={updateField('nopreview')} />
        <BooleanSetting {...data.fullscreen} update={updateField('fullscreen')} />
        <NumberSetting {...data.opacity} update={updateField('opacity')} />
      </SettingsExpander>
    </SettingsWrapper>
  );
};
