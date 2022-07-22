import React from 'react';
import { PreviewSetting, PreviewSettingDesc } from '../../../../shared/settings/preview';
import { BooleanSetting } from './common/BooleanSetting';
import { restoreSettings, updateTypedField } from './common/helperFunctions';
import { SettingsExpander, SettingsExpanderHeader } from './common/SettingsExpander';
import {
  SettingsHeader,
  SettingsHeaderText,
  SettingsRestoreButton,
  SettingsWrapper,
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
      </SettingsExpander>
    </SettingsWrapper>
  );
};
