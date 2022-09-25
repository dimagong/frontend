import "./styles.scss";

import { Row, Col } from "antd";
import React, { useEffect, useState } from "react";

import { NpmSpin } from "features/nmp-ui";

import MemberMenuView from "../MemberMenuView";
import MemberDFormView from "../MemberDFormView";
import MemberSurveyView from "../MemberSurveyView";

import { TypeConstants } from "../../data/constants/typeApplication";

const MemberComponentView = ({ profile, userApplications, initialOnboarding, dForms, surveys }) => {
  const [recentlySubmitted, setRecentlySubmitted] = useState(false);
  const [appActiveOnboarding, setActiveAppOnboarding] = useState(null);

  useEffect(() => {
    setActiveAppOnboarding(initialOnboarding);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialOnboarding.id]);

  const unCompletedApplications = userApplications.filter((application) => {
    if (application.type === TypeConstants.DFORM) {
      return !(application?.status === "approved" || application?.status === "submitted");
    } else {
      return !application.finished_at;
    }
  });

  if (!appActiveOnboarding) {
    return <NpmSpin size={60} />;
  }

  const organization = profile?.permissions?.organization ?? "Surveys organization";
  return (
    <>
      <div className="membercomponent-nemu">
        <MemberMenuView dForms={dForms} surveys={surveys} setActiveAppOnboarding={setActiveAppOnboarding} />
      </div>
      <Row style={{ background: "#f4f4f4б", display: "flex", minHeight: "calc(100vh - 80px)" }}>
        <Col
          span={24}
          style={{
            minHeight: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {appActiveOnboarding.type === TypeConstants.SURVEY && (
            <MemberSurveyView
              selectedSurveyId={appActiveOnboarding.id}
              setRecentlySubmitted={setRecentlySubmitted}
              isRecentlySubmitted={recentlySubmitted}
              isAllApplicationsCompleted={!unCompletedApplications.length}
              organization={organization}
            />
          )}
          {appActiveOnboarding.type === TypeConstants.DFORM && <MemberDFormView dformId={appActiveOnboarding.id} />}
        </Col>
      </Row>
    </>
  );
};

export default MemberComponentView;
