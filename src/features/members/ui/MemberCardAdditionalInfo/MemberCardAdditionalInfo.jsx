import "./styles.scss";

import React, { useState } from "react";

import { UpOutlined, DownOutlined } from "@ant-design/icons";

const MemberCardAdditionalInfo = ({ title, text }) => {
  const [isTextVisible, setIsTextVisible] = useState(false);

  const handleToggle = () => {
    setIsTextVisible(!isTextVisible);
  };

  return (
    <div className="survey-additional">
      <div className="survey-additional_header">
        <div className="survey-additional_header_title">{title}</div>
        <div className="arrow-button" onClick={handleToggle}>
          {isTextVisible ? (
            <DownOutlined style={{ color: "white", fontSize: "10px" }} />
          ) : (
            <UpOutlined style={{ color: "white", fontSize: "10px" }} />
          )}
        </div>
      </div>
      {isTextVisible && <div className="survey-additional_info">{text}</div>}
    </div>
  );
};

export default MemberCardAdditionalInfo;
