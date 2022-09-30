import "./styles.scss";

import React from "react";
import moment from "moment";
import { DatePicker, DatePickerProps } from "antd";

type Props = {
  value?: string;
  onChange?: (isoString: string | null) => void;
} & DatePickerProps;

const NpmDatePicker: React.FC<Props> = (props) => {
  const {
    value,
    style = { width: "100%" },
    mode = "date",
    picker = "date",
    size = "middle",
    placement = "bottomRight",
    placeholder = "Date",
    onChange: propOnChange,
    ...rest
  } = props;

  const onChange: DatePickerProps["onChange"] = (moment) => {
    if (!propOnChange) return;

    if (moment == null) return propOnChange(null);

    propOnChange(moment.toISOString());
  };

  return (
    <DatePicker
      value={value ? (moment(value) as any) : null}
      size={size}
      mode={mode}
      style={style}
      picker={picker}
      placement={placement}
      placeholder={placeholder}
      onChange={onChange}
      {...rest}
    />
  );
};

export default NpmDatePicker;
