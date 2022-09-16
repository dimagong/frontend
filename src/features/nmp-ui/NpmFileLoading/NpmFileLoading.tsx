import "./styles.scss";

import React from "react";

import { ArrowUpOutlined, CloseCircleFilled } from "@ant-design/icons";
import NpmProgress from "./../NpmProgress";

interface IProps {
  fileName?: string;
  percent?: number;
  onClick?: () => void;
}

const NpmFileLoading = ({
  fileName = "No file name",
  percent = 100,
  onClick = () => console.log("Can't delete file"),
}: IProps) => {
  return (
    <>
      <div className="npm-fileLoading">
        <div className="npm-fileLoading_file-name">{fileName}</div>
        <div className={`npm-fileLoading_loader ${percent === 100 ? "loader-success" : "loader-run"}`}>{percent}%</div>
        <div className="npm-fileLoading_icon">
          {percent === 100 ? (
            <CloseCircleFilled onClick={onClick} style={{ color: "#D61515", fontSize: 21 }} />
          ) : (
            <NpmProgress
              strokeColor="#35A046"
              strokeWidth={15}
              width={25}
              percent={percent}
              format={() => <ArrowUpOutlined style={{ color: "#35A046" }} />}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default NpmFileLoading;
