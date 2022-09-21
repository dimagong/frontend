import "./styles.scss";

import React from "react";

import { Progress } from "antd";

interface IProps {
  format?: (percent: number) => any;
  percent?: number;
  status?: "success" | "exception" | "normal" | "active";
  strokeColor?: string;
  strokeLinecap?: "round" | "butt" | "square";
  success?: { percent: number; strokeColor: string };
  trailColor?: string;
  strokeWidth?: number;
  type?: "line" | "circle" | "dashboard";
  //type line
  steps?: number;
  //type="circle"
  width?: number;
  //type="dashboard"
  gapDegree?: number;
  gapPosition?: "top" | "bottom" | "left" | "right";
  typeLineTreck?: "dottedLineTreck" | "";
}

const NpmProgress: React.FC<IProps> = ({
  type = "circle",
  percent = 25,
  typeLineTreck = "dottedLineTreck",
  ...props
}: IProps) => {
  return (
    <div className={typeLineTreck}>
      <Progress type={type} percent={percent} {...props} />
    </div>
  );
};

export default NpmProgress;
