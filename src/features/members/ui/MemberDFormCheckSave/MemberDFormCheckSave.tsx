import "./styles.scss";

import * as React from "react";

import { CheckOutlined } from "@ant-design/icons";

interface IProps {
  isSavedDFormFieldLoading: boolean;
}

const MemberDFormCheckSave: React.FC<IProps> = ({ isSavedDFormFieldLoading }: IProps) => {
  return (
    <>
      <div className="check-save">
        {isSavedDFormFieldLoading ? (
          <span className="check-save_lable">Saving</span>
        ) : (
          <div className="check-save_box">
            <CheckOutlined style={{ color: "#35A046" }} /> <span className="check-save_lable">Saved</span>
          </div>
        )}
      </div>
    </>
  );
};

export default MemberDFormCheckSave;
