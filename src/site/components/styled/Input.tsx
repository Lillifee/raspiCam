import styled from 'styled-components';

export const Input = styled.input`
  padding: 0.2em 0.5em;
  background: ${(p) => p.theme.Background};
  color: ${(p) => p.theme.Foreground};
  border: 1px solid ${(p) => p.theme.Border};
  font-size: ${(p) => p.theme.FontSize.s};
  outline: none;
`;
