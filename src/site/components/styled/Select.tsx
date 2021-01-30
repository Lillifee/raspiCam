import styled from 'styled-components';

export const Select = styled.select`
  height: 2em;
  appearance: none;
  width: 150px;
  padding: 0.2em 1em;
  background: ${(p) => p.theme.Background};
  color: ${(p) => p.theme.Foreground};
  font-size: 14px;
  border: 2px solid ${(p) => p.theme.SubBackground};
  text-align-last: center;
  outline: none;

  option {
    background: ${(p) => p.theme.Background};
    color: ${(p) => p.theme.Foreground};
    display: flex;
  }
`;
