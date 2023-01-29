import styled from 'styled-components';
import { ButtonIcon } from '../../../styled/ButtonIcon.js';
import { Label } from '../../../styled/Label.js';

export const SettingsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 2em 1em;
`;

export const SettingsHeader = styled(Label)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0.2em 0 2em 0;
`;

export const SettingsHeaderText = styled(Label)`
  flex: 1;
`;

export const SettingsRestoreButton = styled(ButtonIcon)`
  flex: 0 0 auto;
`;

export const SettingVerticalWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.6em 0;
`;

export const SettingHorizontalWrapper = styled(SettingVerticalWrapper)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.9em 0;
`;

export const SettingNameValueContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const SettingName = styled(Label)``;
export const SettingValue = styled(Label)`
  color: ${(p) => p.theme?.SubForeground};
`;
