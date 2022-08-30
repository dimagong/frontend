import React, { useState } from "react";

import { Row, Col } from "antd";
import NpmBadge from "./../../nmp-ui/NpmBadge";
import NpmTooltip from "./../../nmp-ui/NpmTooltip";
import NpmPopover from "./../../nmp-ui/NpmPopover";
import { FileProtectOutlined } from "@ant-design/icons";
import { findStatusSurvey } from "./../data/helpers/findStatusSurvey";

const MemberMenuView = ({ dForms, surveys, setActiveAppOnboarding }) => {
  const selectMenuOption = (event) => {
    event.preventDefault();
    const id = event.target.getAttribute("id");
    const type = event.target.getAttribute("type");
    if (type === "dform") {
      const selectedOption = dForms.find((el) => el.id === +id);
      setActiveAppOnboarding({ ...selectedOption, type });
    } else if (type === "survey") {
      const selectedOption = surveys.find((el) => el.id === +id);
      setActiveAppOnboarding({ ...selectedOption, type });
    }
  };

  const contentDForms = dForms.map((form) => {
    return { title: form.name, status: form.status ?? "no-status", id: form.id, type: "dform" };
  });
  const contentSurveys = surveys.map((survey) => {
    const status = findStatusSurvey(survey.started_at, survey.finished_at, survey.graded_at, null);
    return { title: survey.title, status, id: survey.id, type: "survey" };
  });

  return (
    <Row style={{ border: "2px solid blue" }}>
      <Col
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: 200,
          marginTop: 44,
        }}
      >
        <div style={{ width: "auto" }}>
          <NpmPopover title={"Applications"} content={contentDForms} onClick={selectMenuOption}>
            <NpmTooltip text="Applications">
              <NpmBadge name="applications" />
            </NpmTooltip>
          </NpmPopover>
        </div>

        <div style={{ width: "auto" }}>
          <NpmPopover title={"Surveys"} content={contentSurveys} onClick={selectMenuOption}>
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
