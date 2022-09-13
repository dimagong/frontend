import "./styles.scss";

import React, { useState } from "react";

import type { RadioChangeEvent } from "antd";
import { Radio, Space } from "antd";
import NpmRadio from "./../NpmRadio";

interface IProps {
  options: string[];
  handleOptionSelect: (value: string) => void;
  selectedOption?: string;
  direction?: "vertical" | "horizontal";
  size?: "small" | "middle" | "large" | number;
  wrap: boolean;
}

const NpmRadioGroup: Function = ({
  options = [],
  handleOptionSelect,
  selectedOption,
  direction = "vertical",
  size = "middle",
  wrap = false,
}: IProps): JSX.Element => {
  const [selectedValue, onSelectedValue] = useState<string>("");

  const onChange = (e: RadioChangeEvent) => {
    handleOptionSelect(e.target.value);
    onSelectedValue(e.target.value);
  };

  return (
    <Radio.Group onChange={onChange} value={selectedValue}>
      <Space direction={direction} size={size} wrap={wrap}>
        {options.map((option, idx) => {
          return <NpmRadio key={idx} value={option} content={option} className="npmRadio radio-green" />;
        })}
      </Space>
    </Radio.Group>
  );
};

export default NpmRadioGroup;
