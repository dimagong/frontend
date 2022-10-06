import "./styles.scss";

import React, { FC } from "react";

import { Steps, StepsProps } from "antd";

const { Step } = Steps;

type Stepper = StepsProps & {
  sections: Array<{ name?: string; description?: string }>;
  getKey?: (object) => string;
  strideLength?: number;
};

const defaultGetKey = (section) => section.id;

const NpmStepper: FC<Stepper> = (props: Stepper) => {
  const { sections = [], direction = "vertical", strideLength = 70, getKey = defaultGetKey, ...rest } = props;

  return (
    <div className="nmp-stepper">
      <Steps direction={direction} {...rest}>
        {sections.map((section, index) => {
          return (
            <Step
              style={{ height: strideLength }}
              key={getKey(section) ?? index}
              title={section?.name || ""}
              description={section?.description || ""}
            />
          );
        })}
      </Steps>
    </div>
  );
};

export default NpmStepper;
