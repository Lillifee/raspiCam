import * as React from 'react';
import styled from 'styled-components';
import { useThrottle } from '../common/hooks/useDebounce';

//#region styled

const StepperControlContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 1em;
  margin: 1em;

  @media (orientation: portrait) {
    flex-direction: row;
  }
`;

const JoystickContainer = styled.div`
  width: 6em;
  height: 6em;
`;

const JoystickBackground = styled.div`
  position: absolute;
  width: 6em;
  height: 6em;
  border-radius: 50%;
  background: ${(p) => p.theme.SubLayerBackground};
`;

const JoystickControl = styled.div`
  position: absolute;
  width: 3em;
  height: 3em;
  margin: 1.5em;
  pointer-events: all;
  border-radius: 50%;
  touch-action: none;
  background: ${(p) =>
    `radial-gradient(circle, ${p.theme.Foreground} 0%, ${p.theme.SubForeground} 80%)`};
`;

//#endregion

interface JoystickPosition {
  x: number;
  y: number;
}

interface JoystickDrag {
  start?: JoystickPosition;
  pos?: JoystickPosition;
}

interface JoystickProps {
  minDrag?: number;
  maxDrag?: number;
  onValueChange: (pos: JoystickPosition) => void;
}

const Joystick: React.FC<JoystickProps> = ({ minDrag = 8, maxDrag = 60, onValueChange }) => {
  const stick = React.useRef<HTMLDivElement>(null);
  const [drag, setDrag] = React.useState<JoystickDrag>({});

  const handleDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setDrag({ start: { x: e.clientX, y: e.clientY } });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handleMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.start) return;
    if (!e.buttons) {
      setDrag({});
      return;
    }

    const diff: JoystickPosition = {
      x: e.clientX - drag.start.x,
      y: e.clientY - drag.start.y,
    };

    const angle = Math.atan2(diff.y, diff.x);
    const distance = Math.min(maxDrag, Math.hypot(diff.x, diff.y));

    const pos: JoystickPosition = {
      x: distance * Math.cos(angle),
      y: distance * Math.sin(angle),
    };

    setDrag((prev) => ({ ...prev, pos }));

    // TODO try to use position
    const valDistance =
      distance < minDrag ? 0 : (maxDrag / (maxDrag - minDrag)) * (distance - minDrag);

    const valPos: JoystickPosition = {
      x: valDistance * Math.cos(angle),
      y: valDistance * Math.sin(angle),
    };

    onValueChange({
      x: parseFloat((valPos.x / maxDrag).toFixed(4)),
      y: parseFloat((valPos.y / maxDrag).toFixed(4)),
    });
  };

  const handleUp = () => {
    if (!drag.start) return;
    onValueChange({ x: 0, y: 0 });
    setDrag({});
  };

  return (
    <JoystickControl
      ref={stick}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onLostPointerCapture={handleUp}
      style={{
        transform: drag.pos
          ? `translate3d(${drag.pos.x}px, ${drag.pos.y}px, 0px)`
          : 'translate3d(0px, 0px, 0px)',
        transition: drag.start ? '0s' : '.2s',
      }}
    />
  );
};

const useStepperControl = () => {
  const abortFetch = React.useRef(new AbortController());

  const update = React.useCallback((pos: JoystickPosition) => {
    // abort the previous running fetch
    abortFetch.current.abort();
    abortFetch.current = new AbortController();

    fetch('api/stepper/control', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pos),
      signal: abortFetch.current.signal,
    }).catch((error) => console.error('Control failed', error));
  }, []);

  // Throttle the update
  return useThrottle(update, 200);
};

export const StepperControl: React.FC = () => {
  const [control] = useStepperControl();

  return (
    <StepperControlContainer>
      <JoystickContainer>
        <JoystickBackground />
        <Joystick onValueChange={control} />
      </JoystickContainer>
    </StepperControlContainer>
  );
};
