import { styled } from 'styled-components';

export const Button = styled.button`
  height: 2em;
  appearance: none;
  padding: 0.2em 0.5em;
  background: ${(p) => p.theme.Background};
  color: ${(p) => p.theme.Foreground};
  font-size: 14px;
  border: 1px solid ${(p) => p.theme.Border};
  text-align-last: center;
  outline: none;
  cursor: pointer;

  :disabled {
    opacity: 0.5;
  }

  :active {
    background: ${(props) => props.theme.SelectedBackground};
    color: ${(props) => props.theme.SelectedForeground};
    fill: ${(props) => props.theme.SelectedForeground};
  }
`;
