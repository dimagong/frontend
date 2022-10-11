import "./styles.scss";

import { Row, Col } from "antd";
import React, { useState } from "react";

import { NpmSpin } from "features/nmp-ui";

import MemberDFormView from "../MemberDFormView";
import MemberSurveyView from "../MemberSurveyView";
import { MemberMenuView } from "../MemberMenuView";

import { TypeConstants } from "../../data/constants/typeApplication";

const MemberComponentView = (props) => {
  const { profile, userApplications, initialOnboarding, dForms, surveys, dFormsCategories } = props;

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
      <Row justify="center" align="center" style={{ background: "#f4f4f4б" }}>
        <Col span={23}>
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
