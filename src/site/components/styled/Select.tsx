import { styled } from 'styled-components';

export const Select = styled.select`
  height: 2em;
  appearance: none;
  width: 130px;
  padding: 0.2em 0.5em;
  background: ${(p) => p.theme.Background};
  color: ${(p) => p.theme.Foreground};
  font-size: 14px;
  border: 1px solid ${(p) => p.theme.Border};
  text-align-last: center;
  outline: none;
  cursor: pointer;

  option {
    background: ${(p) => p.theme.Background};
    color: ${(p) => p.theme.Foreground};
    display: flex;
  }
`;
