import React from "react";

import CSS from "csstype";

import { TimePicker } from "antd";
import type { Moment } from "moment";

interface IProps {
  onChangeTime: (time, timeString) => void;
  defaultTime?: string;
  defaultTimeType?: string;
  format?: string;
  hourStep?: number;
  minuteStep?: number;
  secondStep?: number;
  use12Hours?: boolean;
  placeholder?: string;
  placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
  popupStyle?: CSS.Properties;
  status?: "" | "error" | "warning" | undefined;
  style?: CSS.Properties;
  className?: string;
}

const NpmTimePicker = ({
  onChangeTime,
  //   defaultTime = "00:00:00",
  //   defaultTimeType = "HH:mm:ss",
  format = "HH:mm:ss",
  hourStep = 1,
  minuteStep = 1,
  secondStep = 1,
  use12Hours = true,
  placeholder = "Time",
  placement = "bottomRight",
  popupStyle = {},
  status = "",
  style = { width: "100%" },
  className = "",
}: IProps) => {
  const onChange = (time: Moment | any, timeString: string) => {
    console.log(time, timeString);
    onChangeTime(time, timeString);
  };

  return (
    <TimePicker
      onChange={onChange}
      //? as any - because of conflict mpment with ant version
      //   defaultValue={moment(defaultTime, defaultTimeType) as any}
      format={format}
      hourStep={hourStep}
      minuteStep={minuteStep}
      secondStep={secondStep}
      placeholder={placeholder}
      placement={placement}
      // @ts-ignore
      popupStyle={popupStyle}
      status={status}
      use12Hours={use12Hours}
      // @ts-ignore
      style={style}
      className={className}
    />
  );
};

export default NpmTimePicker;
