import styled, { css } from 'styled-components';

export interface RadioButtonProps {
  active: boolean;
}

const activeCss = css`
  background: ${(props) => props.theme.PrimaryBackground};
  color: ${(props) => props.theme.PrimaryForeground};
  fill: ${(props) => props.theme.PrimaryForeground};
`;

export const RadioButton = styled.button<RadioButtonProps>`
  flex: 1;
  border: 0;
  outline: none;
  display: flex;
  background: transparent;
  padding: 0.3em 1.5em;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  fill: ${(props) => props.theme.Foreground};
  color: ${(props) => props.theme.Foreground};
  font-size: ${(props) => props.theme.FontSize.s};

  > svg {
    width: 24px;
    height: 24px;
  }

  :disabled {
    opacity: 0.5;
  }

  :active {
    background: ${(props) => props.theme.SelectedBackground};
    color: ${(props) => props.theme.SelectedForeground};
    fill: ${(props) => props.theme.SelectedForeground};
  }

  ${(p) => p.active && activeCss}
`;

export const RadioContainer = styled.div`
  display: flex;
  flex-direction: row;
  border-radius: 0.3em;

  overflow: hidden;
  background: ${(p) => p.theme.Background};
  border: 1px solid ${(p) => p.theme.Border};
`;
