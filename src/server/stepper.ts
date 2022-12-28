import { BinaryValue, Gpio } from 'onoff';
import { StepperSetting } from '../shared/settings/stepper';
import { RaspiStepperControl } from '../shared/settings/types';
import { SettingsHelper } from './settings';

export const createStepperControl = (settingsHelper: SettingsHelper) => {
  const steppers = [createStepper(), createStepper()];
  const [stepperX, stepperY] = steppers;

  const running = false;

  const runStepper = () => {
    const running = steppers.reduce((prev, stepper) => stepper.run() || prev, false);

    if (running) {
      setImmediate(runStepper);
    }
  };

  const run = () => !running && runStepper();

  const applySettings = () => {
    stepperX.applySettings(settingsHelper.xAxis.convert());
    stepperY.applySettings(settingsHelper.yAxis.convert());
    run();
  };

  const setSpeed = (stepperSpeed: RaspiStepperControl) => {
    stepperX.setSpeed(stepperSpeed.x);
    stepperY.setSpeed(stepperSpeed.y);

    run();
  };

  applySettings();

  return { run, setSpeed, applySettings };
};

export type StepperControl = ReturnType<typeof createStepperControl>;

// 's' - time[0] + time[1]/100000000
// 'm' - time[0]*1000 + time[1]/1000000
// 'u' - time[0]*1000000 + time[1]/1000
// 'n' - time[0]*1000000000 + time[1]
const hrTimeToMicro = (time: [number, number]) => time[0] * 1000000 + time[1] / 1000;

export const createStepper = () => {
  let stp: Gpio | undefined;
  let dir: Gpio | undefined;
  let ena: Gpio | undefined;

  let lastStepTime = 0;
  let stepInterval: number | undefined;
  let minStepInterval = 1;
  let initStepInterval = 0;
  let nextStepInterval = 0;
  let stepCounter = 0;

  let speed = 0;
  let direction: BinaryValue = 0;
  let acceleration = 0;
  let maxSpeed = 1;

  let targetPos = 0;
  let currentPos = 0;

  let runSpeed = false;
  let enabled = false;

  const applySettings = (settings: StepperSetting) => {
    enabled = !!settings.enabled;
    stp = settings.enabled ? new Gpio(settings.stepPin || 27, 'out') : undefined;
    dir = settings.enabled ? new Gpio(settings.dirPin || 17, 'out') : undefined;
    ena = settings.enabled ? new Gpio(settings.enaPin || 22, 'out') : undefined;

    setMaxSpeed(settings.maxSpeed || 600);
    setAcceleration(settings.acceleration || 400);
  };

  const distanceToGo = () => targetPos - currentPos;

  const computeNewSpeed = () => {
    const distanceTo = distanceToGo();
    const stepsToStop = Math.floor((speed * speed) / (2.0 * acceleration));

    if (distanceTo == 0 && stepsToStop <= 1) {
      speed = 0.0;
      stepInterval = 0;
      stepCounter = 0;
      return;
    }

    if (distanceTo > 0) {
      if (stepCounter > 0 && (stepsToStop >= distanceTo || direction == 0)) {
        stepCounter = -stepsToStop;
      } else if (stepCounter < 0 && stepsToStop < distanceTo && direction === 1) {
        stepCounter = -stepCounter;
      }
    } else if (distanceTo < 0) {
      if (stepCounter > 0 && (stepsToStop >= -distanceTo || direction == 1)) {
        stepCounter = -stepsToStop;
      } else if (stepCounter < 0 && stepsToStop < -distanceTo && direction == 0) {
        stepCounter = -stepCounter;
      }
    }

    if (stepCounter == 0) {
      nextStepInterval = initStepInterval;
      direction = distanceTo > 0 ? 1 : 0;
    } else {
      nextStepInterval = nextStepInterval - (2.0 * nextStepInterval) / (4.0 * stepCounter + 1);
      nextStepInterval = Math.max(nextStepInterval, minStepInterval);
    }

    stepCounter++;
    stepInterval = nextStepInterval;
    speed = 1000000.0 / nextStepInterval;
    if (direction == 0) {
      speed = -speed;
    }

    // disable continues run
    runSpeed = false; // TODO maybe we can do that more explicit
  };

  const running = () => speed != 0 || (!runSpeed && distanceToGo() != 0);

  const run = () => {
    if (!enabled) return false;
    if (loop()) {
      if (!runSpeed) {
        computeNewSpeed();
      }
    }

    const isRunning = running();
    if (!isRunning) {
      ena?.writeSync(1);
    }
    return isRunning;
  };

  const loop = () => {
    if (!stepInterval) {
      return false;
    }

    const time = hrTimeToMicro(process.hrtime());
    if (time - lastStepTime >= stepInterval) {
      step();
      lastStepTime = time;
      return true;
    }

    return false;
  };

  const step = () => {
    ena?.writeSync(0);
    dir?.writeSync(direction);
    stp?.writeSync(1);
    stp?.writeSync(0);
    currentPos += direction ? 1 : -1;
  };

  const setMaxSpeed = (s: number) => {
    maxSpeed = Math.abs(s);
    minStepInterval = 1000000.0 / maxSpeed;

    if (stepCounter > 0) {
      stepCounter = Math.floor((maxSpeed * maxSpeed) / (2.0 * acceleration));
      computeNewSpeed();
    }
  };

  const setAcceleration = (accel: number) => {
    accel = Math.abs(accel);
    stepCounter = stepCounter * (acceleration / accel);
    initStepInterval = 0.676 * Math.sqrt(2.0 / accel) * 1000000.0;
    acceleration = accel;
    computeNewSpeed();
  };

  const moveTo = (absolute: number) => {
    if (targetPos != absolute) {
      targetPos = absolute;
      computeNewSpeed();
    }
  };

  const move = (relative: number) => {
    moveTo(currentPos + relative);
  };

  const setSpeed = (s: number) => {
    runSpeed = true;

    speed = maxSpeed * s;

    stepInterval = speed === 0 ? 0 : Math.abs(1000000.0 / speed);
    direction = speed > 0 ? 1 : 0;
  };

  return {
    setSpeed,
    move,
    moveTo,
    setAcceleration,
    setMaxSpeed,
    applySettings,
    run,
    running,
  };
};

export type Stepper = ReturnType<typeof createStepper>;
