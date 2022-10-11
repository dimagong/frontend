import "./styles.scss";

import React, { FC } from "react";
import classnames from "classnames";
import { Steps, StepsProps } from "antd";

const { Step } = Steps;

type StepperProps = StepsProps & {
  sections: Array<{ name?: string; description?: string }>;
  getKey?: (object) => string;
  strideLength?: number;
};

const defaultGetKey = (section) => section.id;

export const NmpStepper: FC<StepperProps> = (props) => {
  const {
    sections = [],
    direction = "vertical",
    strideLength = 70,
    getKey = defaultGetKey,
    className,
    ...rest
  } = props;

  return (
    <Steps direction={direction} className={classnames("nmp-stepper", className)} {...rest}>
      {sections.map((section, index) => {
        return (
          <Step
            title={section?.name || ""}
            description={section?.description || ""}
            style={{ height: strideLength }}
            key={getKey(section) ?? index}
          />
        );
      })}
    </Steps>
  );
};
