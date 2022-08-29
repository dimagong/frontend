import React, { useState } from "react";

import { Row, Col } from "antd";
import NpmBadge from "./../../nmp-ui/NpmBadge";
import NpmTooltip from "./../../nmp-ui/NpmTooltip";
import NpmPopover from "./../../nmp-ui/NpmPopover";
import { FileProtectOutlined } from "@ant-design/icons";

const MemberMenuView = () => {
  const [menuOption, onMenuOption] = useState("null");

  const selectMenuOption = (event) => {
    event.preventDefault();
    const optionName = event.target.getAttribute("name");
    onMenuOption(optionName);
  };
  console.log("menuOption", menuOption);
  const content = [
    { name: "First sirvey", type: "new" },
    { name: "Second sirvey", type: "pass" },
  ];
  return (
    <Row>
      <Col
        style={{
          border: "2px solid blue",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: 200,
          marginTop: 44,
        }}
      >
        <div style={{ width: "auto" }}>
          <NpmPopover title={"Applications"} content={content} onClick={selectMenuOption}>
            <NpmTooltip text="Applications">
              <NpmBadge name="applications" />
            </NpmTooltip>
          </NpmPopover>
        </div>

        <div style={{ width: "auto" }}>
          <NpmPopover title={"Surveys"} onClick={selectMenuOption}>
            <NpmTooltip text="Surveys">
              <NpmBadge name="survey" icon={<FileProtectOutlined style={{ fontSize: 42, color: "#BCBCBC" }} />} />
            </NpmTooltip>
          </NpmPopover>
        </div>
      </Col>
    </Row>
  );
};

export default MemberMenuView;
