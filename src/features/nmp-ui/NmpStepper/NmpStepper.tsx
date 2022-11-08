import "./styles.scss";

import React, { FC } from "react";
import classnames from "classnames";
import { Steps, StepsProps } from "antd";

const { Step } = Steps;

type Section = {
  id: string;
  name: string;
  description: string;
  isDisabled: boolean;
  isAlreadyViewed: boolean;
};

type StepperProps = StepsProps & {
  sections: Array<Section>;
  getKey?: (object) => string;
  strideLength?: number;
};

const defaultGetKey = (section) => section.id;

export const NmpStepper: FC<StepperProps> = (props) => {
  const {
    current,
    sections = [],
    direction = "vertical",
    strideLength = 70,
    getKey = defaultGetKey,
    className,
    percent = 0,
    ...rest
  } = props;

  return (
    <Steps
      direction={direction}
      current={current}
      percent={percent}
      className={classnames("nmp-stepper", className)}
      {...rest}
    >
      {sections.map((section, index) => {
        const isDisabled = section.isDisabled;

        return (
          <Step
            title={section?.name || ""}
            // status={section.status as any}
            disabled={isDisabled}
            description={section?.description || ""}
            style={{ height: strideLength }}
            key={getKey(section) ?? index}
          />
        );
      })}
    </Steps>
  );
};
