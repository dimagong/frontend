import React from "react";
import { Progress } from "antd";
import type { FC, ReactNode } from "react";
import { CheckOutlined } from "@ant-design/icons";

export type DFormMemberTabLabelProps = {
  isActive?: boolean;
  progress?: number;
  children?: ReactNode;
};

export const DFormMemberTabLabel: FC<DFormMemberTabLabelProps> = (props) => {
  const { progress = 0, isActive = false, children } = props;

  return (
    <>
      <div className="dform-member-tabs__tail" />

      <div className="dform-member-tabs__label">
        <div className="dform-member-tabs__icon">
          {progress === 100 && !isActive ? (
            <CheckOutlined />
          ) : (
            <Progress
              type="circle"
              width={34}
              status="normal"
              percent={progress}
              showInfo={false}
              trailColor="transparent"
              strokeWidth={3}
            />
          )}
        </div>

        {children}
      </div>
    </>
  );
};
