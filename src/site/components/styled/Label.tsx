import { styled } from 'styled-components';

export interface LabelProps {
  fontSize?: 'xs' | 's' | 'm' | 'l' | 'xl';
}

export const Label = styled.label<LabelProps>`
  color: ${(p) => p.theme.Foreground};
  font-size: ${({ fontSize, theme }) => theme.FontSize[fontSize || 'm']};
  margin: 0.2em 0;
`;

export const SubLabel = styled(Label)`
  color: ${(props) => props.theme?.SubForeground};
`;

export const Space = styled.div`
  margin-bottom: 1em;
`;
