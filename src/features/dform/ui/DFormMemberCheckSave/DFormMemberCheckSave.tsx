import "./styles.scss";

import React from "react";
import type { FC } from "react";
import { CheckOutlined } from "@ant-design/icons";

export type DFormMemberCheckSaveProps = {
  isLoading?: boolean;
};

export const DFormMemberCheckSave: FC<DFormMemberCheckSaveProps> = (props) => {
  const { isLoading = false } = props;

  return (
    <div className="dform-member-check-save">
      {isLoading ? (
        <span className="dform-member-check-save__label">Saving</span>
      ) : (
        <div className="dform-member-check-save__box">
          <CheckOutlined style={{ color: "#35A046" }} /> <span className="dform-member-check-save__label">Saved</span>
        </div>
      )}
    </div>
  );
};
