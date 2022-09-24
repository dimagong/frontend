import "./styles.scss";

import React, { useState } from "react";
import { UpOutlined, DownOutlined } from "@ant-design/icons";

import { NpmTooltip, NpmButton } from "features/nmp-ui";

const MemberSurveyAdditionalInfo = ({ title, text }) => {
  const [isTextVisible, setIsTextVisible] = useState(false);

  const handleToggle = () => {
    setIsTextVisible(!isTextVisible);
  };

  return (
    <div className="survey-additional">
      <div className="survey-additional_header">
        <div className="survey-additional_header_title">{title}</div>
        <NpmTooltip title="Guidance">
          <NpmButton
            size="small"
            type="nmp-primary"
            shape="nmp-ellipse"
            icon={
              isTextVisible ? (
                <DownOutlined style={{ fontSize: "10px" }} />
              ) : (
                <UpOutlined style={{ fontSize: "10px" }} />
              )
            }
            onClick={handleToggle}
          />
        </NpmTooltip>
      </div>
      {isTextVisible && <div className="survey-additional_info">{text}</div>}
    </div>
  );
};

export default MemberSurveyAdditionalInfo;
