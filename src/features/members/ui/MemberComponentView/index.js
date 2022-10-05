import "./styles.scss";

import { Row, Col } from "antd";
import React, { useState } from "react";

import { NpmSpin } from "features/nmp-ui";

import MemberDFormView from "../MemberDFormView";
import MemberSurveyView from "../MemberSurveyView";
import { MemberMenuView } from "../MemberMenuView";

import { TypeConstants } from "../../data/constants/typeApplication";

const MemberComponentView = ({ profile, userApplications, initialOnboarding, dForms, surveys, dFormsCategories }) => {
  const [recentlySubmitted, setRecentlySubmitted] = useState(false);
  const [activeOnboarding, setActiveOnboarding] = useState(() => initialOnboarding);

  const unCompletedApplications = userApplications.filter((application) => {
    if (application.type === TypeConstants.DFORM) {
      return !(application?.status === "approved" || application?.status === "submitted");
    } else {
      return !application.finished_at;
    }
  });

  const onMenuChange = (onboarding) => setActiveOnboarding(onboarding);

  if (!activeOnboarding) {
    return <NpmSpin size={60} />;
  }

  const organization = profile?.permissions?.organization ?? "Surveys organization";

  return (
    <>
      <div className="membercomponent-menu">
        <div className="membercomponent-menu-wrapper">
          <MemberMenuView
            dforms={dForms}
            dFormsCategories={dFormsCategories}
            surveys={surveys}
            onboardings={userApplications}
            activeOnboarding={activeOnboarding}
            onMenuChange={onMenuChange}
          />
        </div>
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
          {activeOnboarding.type === TypeConstants.SURVEY && (
            <MemberSurveyView
              selectedSurveyId={activeOnboarding.id}
              setRecentlySubmitted={setRecentlySubmitted}
              isRecentlySubmitted={recentlySubmitted}
              isAllApplicationsCompleted={!unCompletedApplications.length}
              organization={organization}
            />
          )}
          {activeOnboarding.type === TypeConstants.DFORM && (
            <MemberDFormView
              dformId={activeOnboarding.id}
              status={activeOnboarding.status}
              organization={profile.permissions.organization}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default MemberComponentView;
