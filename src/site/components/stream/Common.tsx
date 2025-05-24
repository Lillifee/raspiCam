import styled from 'styled-components';

interface BlurOverlayProps {
  $blur: boolean;
}

export const BlurOverlay = styled.div<BlurOverlayProps>`
  backdrop-filter: ${(p) => (p.$blur ? 'blur(10px)' : '')};
  background-color: ${(p) => (p.$blur ? 'rgba(0, 0, 0, 0.5)' : '')};
  transition:
    backdrop-filter ease-in-out 0.3s,
    background-color ease-in-out 0.3s;
  position: absolute;
  width: 100%;
  height: 100%;
`;
