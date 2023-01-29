import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import styled, { keyframes } from 'styled-components';
import { shallowEqualObjects } from '../../../shared/helperFunctions.js';

//#region styled

const fadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

// Wrapper not added
// <PopoverWrapper id="Popover" />

export const PopoverWrapper = styled.div`
  display: flex;
  overflow: hidden;
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 100;
  pointer-events: none;

  > div {
    flex: 1;
    display: flex;
    overflow: hidden;
  }
`;

export const PopoverContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.5em 1em;
  backdrop-filter: blur(5px);
  background-color: ${(p) => p.theme.LayerBackground};
  animation: 0.2s ${fadeIn};
`;

const Background = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: transparent;
`;

interface ContainerPositionSize {
  $top: number;
  $left: number;
  $right: number;
  $bottom: number;
  $maxWidth: number;
  $maxHeight: number;
}

const Container = styled.div<ContainerPositionSize>`
  flex: 1;
  display: grid;
  grid-template-columns:
    minmax(0, ${(p) => p.$left}px)
    minmax(min(${(p) => p.$maxWidth}px, 100%), ${(p) => p.$maxWidth}px)
    minmax(0, ${(p) => p.$right}px);
  grid-template-rows:
    minmax(0, ${(p) => p.$top}px)
    minmax(min(${(p) => p.$maxHeight}px, 100%), ${(p) => p.$maxHeight}px)
    minmax(0, ${(p) => p.$bottom}px);

  pointer-events: all;
`;

const Element = styled.div`
  grid-row: 2;
  grid-column: 2;
`;

//#endregion

type Direction = 'right' | 'left' | 'top' | 'bottom';

interface Popover {
  show: boolean;
  direction?: Direction;
  onClose: () => void;
}

interface Position extends Record<string, unknown> {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

interface Size {
  maxWidth: number;
  maxHeight: number;
}

interface RectProps extends Position {
  width: number;
  height: number;
}

export interface PortalContainerProps {
  children: React.ReactNode;
}

export const PortalPopover: React.FC<PortalContainerProps> = ({ children }) => {
  const element = React.useMemo<HTMLDivElement>(() => document.createElement('div'), []);

  React.useEffect(() => {
    const popoverRoot = document.getElementById('Popover');
    popoverRoot?.appendChild(element);
    return () => {
      popoverRoot?.removeChild(element);
    };
  }, [element]);

  return ReactDOM.createPortal(children, element);
};

interface PopoverContentProps extends Popover, Size {
  parentRect?: RectProps;
  children: React.ReactNode;
}

const emptyPosition = { top: 0, left: 0, right: 0, bottom: 0 };

export const PopoverContent: React.FC<PopoverContentProps> = ({
  parentRect,
  children,
  maxWidth,
  maxHeight,
  direction,
  onClose,
}) => {
  const [gridPosition, setGridPosition] = React.useState<Position>(emptyPosition);

  useEffect(() => {
    if (parentRect) {
      switch (direction) {
        case 'left':
          setGridPosition({
            ...parentRect,
            right: parentRect.left,
            left: Math.max(0, parentRect.left - maxWidth),
          });
          break;
        case 'right':
          setGridPosition({ ...parentRect, left: parentRect.right, right: 0 });
          break;
        case 'top':
          setGridPosition({
            ...parentRect,
            bottom: parentRect.top,
            top: Math.max(0, parentRect.top - maxHeight),
          });
          break;
        default:
          setGridPosition({ ...parentRect, top: parentRect.bottom, bottom: 0 });
          break;
      }
    }
  }, [parentRect, direction, maxWidth, maxHeight]);

  return (
    <Container
      {...gridPosition}
      $left={gridPosition.left}
      $top={gridPosition.top}
      $bottom={gridPosition.bottom}
      $right={gridPosition.right}
      $maxWidth={maxWidth}
      $maxHeight={maxHeight}
      onClick={(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => e.stopPropagation()}
    >
      <Background onClick={onClose} />
      <Element onClick={(e) => e.stopPropagation()}>{children}</Element>
    </Container>
  );
};

interface PopoverProps extends Popover, Partial<Size> {
  children: React.ReactNode;
}

export const Popover: React.FC<PopoverProps> = ({ children, maxWidth, maxHeight, ...props }) => {
  const placeholder = React.useRef<HTMLElement>(null);
  const [parentRect, setParentRect] = React.useState<RectProps>();

  if (props.show) {
    const clientRect = placeholder.current?.parentElement?.getBoundingClientRect();

    if (clientRect) {
      const newRect = (({ bottom, height, left, right, top, width }) => ({
        bottom: Math.round(bottom),
        height: Math.round(height),
        left: Math.round(left),
        right: Math.round(right),
        top: Math.round(top),
        width: Math.round(width),
      }))(clientRect);

      if (!shallowEqualObjects(newRect, parentRect)) {
        setParentRect(newRect);
      }
    }
  }

  return (
    <React.Fragment>
      <span ref={placeholder} />
      {props.show && (
        <PortalPopover>
          <PopoverContent
            {...props}
            maxWidth={maxWidth || 400}
            maxHeight={maxHeight || 200}
            parentRect={parentRect}
          >
            {children}
          </PopoverContent>
        </PortalPopover>
      )}
    </React.Fragment>
  );
};
