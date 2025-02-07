import "./styles.scss";

import React from "react";
import type { FC } from "react";
import { Steps, StepsProps, StepProps } from "antd";

type ItemsType = Array<Omit<StepProps, "status"> & { status?: "wait" | "process" | "finish" }>;

export type DFormStepsProps = Pick<StepsProps, "percent" | "current" | "onChange"> & { items?: ItemsType };

export const DFormSteps: FC<DFormStepsProps> = (props) => {
  const { items, percent, current, onChange } = props;

  return (
    <Steps
      items={items}
      percent={percent}
      current={current}
      direction="vertical"
      className="dform-steps"
      onChange={onChange}
    />
  );
};
