import React, { FC } from "react";
import { Tooltip, TooltipProps } from "antd";

export const NpmTooltip: FC<TooltipProps> = ({ children, ...props }) => {
  return <Tooltip {...props}>{children}</Tooltip>;
};
