import React from 'react';
import { DefaultTheme, useTheme } from 'styled-components';
import { Select } from '../../styled/Select';
import { allThemes } from '../../theme/themes';
import { SettingsExpander, SettingsExpanderHeader } from './common/SettingsExpander';
import {
  SettingHorizontalWrapper,
  SettingName,
  SettingsHeader,
  SettingsHeaderText,
  SettingsWrapper,
} from './common/Styled';

export interface ApplicationSettingsProps {
  setTheme: (theme: DefaultTheme) => void;
}

export const ApplicationSettings: React.FC<ApplicationSettingsProps> = ({ setTheme }) => {
  const activeTheme = useTheme();
  return (
    <SettingsWrapper>
      <SettingsHeader fontSize="m">
        <SettingsHeaderText>Application</SettingsHeaderText>
      </SettingsHeader>

      <SettingsExpander header={<SettingsExpanderHeader>General</SettingsExpanderHeader>}>
        <SettingHorizontalWrapper>
          <SettingName fontSize="s">Theme</SettingName>
          <Select value={activeTheme.Name} onChange={(e) => setTheme(allThemes[e.target.value])}>
            {Object.keys(allThemes).map((theme) => (
              <option key={theme} value={theme}>
                {theme}
              </option>
            ))}
          </Select>
        </SettingHorizontalWrapper>
      </SettingsExpander>
    </SettingsWrapper>
  );
};
