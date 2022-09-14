import "./styles.scss";

import React from "react";

import { Steps } from "antd";

const { Step } = Steps;

interface IProps {
  sections: any[];
  direction?: "vertical" | "horizontal";
  size?: "small" | "default";
  current?: number;
  initial?: number;
  status?: "wait" | "process" | "finish" | "error";
  type?: "default" | "navigation";
  onChange?: (current: number) => void;
}

const NpmStepper = ({
  sections = [],
  direction = "vertical",
  size = "default",
  current = 0,
  initial = 0,
  status = "process",
  type = "default",
  onChange,
}: IProps) => {
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
      {sections.map((section, idx) => {
        return <Step key={idx} title={section?.title || ""} description={section?.description || ""} />;
      })}
    </Steps>
  );
};

export default NpmStepper;
