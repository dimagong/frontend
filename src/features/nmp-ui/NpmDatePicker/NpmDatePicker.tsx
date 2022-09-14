import React from "react";

import CSS from "csstype";

import type { DatePickerProps } from "antd";
import { DatePicker } from "antd";

interface IProps {
  onChangeDate: (date, dateString) => void;
  style?: CSS.Properties;
  popupStyle?: CSS.Properties;
  status?: "error" | "warning" | "";
  mode?: "time" | "date" | "month" | "year" | "decade";
  picker?: "date" | "week" | "month" | "quarter" | "year";
  size?: "large" | "middle" | "small";
  placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
  placeholder?: string;
}

const NpmDatePicker = ({
  onChangeDate,
  style = { width: "100%" },
  mode = "date",
  picker = "date",
  status = "",
  size = "middle",
  placement = "bottomRight",
  placeholder = "Date",
  popupStyle = {},
}: IProps) => {
  const onChange: DatePickerProps["onChange"] = (date, dateString) => {
    // console.log(date, dateString);
    onChangeDate(date, dateString);
  };
  return (
    <DatePicker
      style={style}
      onChange={onChange}
      mode={mode}
      picker={picker}
      status={status}
      size={size}
      placement={placement}
      placeholder={placeholder}
      popupStyle={popupStyle}
    />
  );
};

export default NpmDatePicker;
