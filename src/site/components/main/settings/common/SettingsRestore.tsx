import React from 'react';
import { SettingsRestoreButton } from './Styled';

interface Props {
  name: string;
  updateSettings: () => void;
}

export const SettingsRestore: React.FC<Props> = ({ name, updateSettings }) => (
  <SettingsRestoreButton
    type="ListRemove"
    onClick={() => {
      if (
        confirm(
          `Restoring the ${name} configuration will reset the current settings to their default values.\n\nAre you sure you want to continue?`,
        )
      ) {
        updateSettings();
      }
    }}
  />
);
