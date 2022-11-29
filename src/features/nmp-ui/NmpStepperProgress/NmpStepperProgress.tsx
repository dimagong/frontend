import "./styles.scss";

import React from "react";
import type { FC } from "react";
import { NmpRow, NmpCol } from "features/nmp-ui";

export type NmpStepperProgressProps = {
  steps: number;
  current?: number;
};

export const NmpStepperProgress: FC<NmpStepperProgressProps> = (props) => {
  const { steps, current = 0 } = props;
  const gutter = steps > 30 ? 4 : 10;

  return (
    <NmpRow justify="space-between" gutter={gutter} className="nmp-stepper-progress">
      {Array(steps)
        .fill(null)
        .map((_, index) => {
          return (
            <NmpCol style={{ width: `calc(100% / ${steps})` }} key={`step-${index}`}>
              {current > index ? (
                <div className="nmp-stepper-progress__step nmp-stepper-progress__step--passed" />
              ) : (
                <div className="nmp-stepper-progress__step nmp-stepper-progress__step--awaiting" />
              )}
            </NmpCol>
          );
        })}
    </NmpRow>
  );
};
