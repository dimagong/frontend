import "./styles.scss";

import React, { FC } from "react";

import { Steps } from "antd";

const { Step } = Steps;

interface IProps {
  sections: Array<{ name?: string; description?: string }>;
  direction?: "vertical" | "horizontal";
  size?: "small" | "default";
  current?: number;
  initial?: number;
  status?: "wait" | "process" | "finish" | "error";
  type?: "default" | "navigation";
  onChange?: (current: number) => void;
  getKey?: (object) => string;
}

const defaultGetKey = (section) => section.id;

const NpmStepper: FC<IProps> = (props) => {
  const {
    sections = [],
    direction = "vertical",
    size = "default",
    current = 0,
    initial = 0,
    status = "process",
    type = "default",
    onChange = (current: number) => {
      console.log("Stepper number", current);
    },
    getKey = defaultGetKey,
  } = props;

  return (
    <Steps
      direction={direction}
      size={size}
      current={current}
      status={status}
      initial={initial}
      type={type}
      onChange={onChange}
    >
      {sections.map((section, index) => {
        return (
          <Step key={getKey(section) ?? index} title={section?.name || ""} description={section?.description || ""} />
        );
      })}
    </Steps>
  );
};

export default NpmStepper;
