import React from "react";
import moment from "moment";
import { TimePicker, TimePickerProps } from "antd";

type Props = Omit<TimePickerProps, "value" | "onChange"> & {
  value?: string;
  onChange?: (isoString: string | null) => void;
};

const NpmTimePicker: React.FC<Props> = (props) => {
  const {
    value,
    format = "HH:mm:ss",
    hourStep = 1,
    minuteStep = 1,
    secondStep = 1,
    use12Hours = true,
    placeholder = "Time",
    placement = "bottomRight",
    style = { width: "100%" },
    className,
    onChange: propOnChange,
    ...rest
  } = props;

  const onChange: TimePickerProps["onChange"] = (moment) => {
    if (!propOnChange) return;

    if (moment == null) return propOnChange(null);

    propOnChange(moment.toISOString());
  };

  return (
    <TimePicker
      value={value ? (moment(value) as any) : null}
      format={format}
      hourStep={hourStep}
      minuteStep={minuteStep}
      secondStep={secondStep}
      placeholder={placeholder}
      placement={placement}
      use12Hours={use12Hours}
      style={style}
      className={className}
      onChange={onChange}
      {...rest}
    />
  );
};

export default NpmTimePicker;
