import "./styles.scss";

import { Row, Col } from "antd";
import React, { useState } from "react";

import { NpmSpin } from "features/nmp-ui";

import { MemberMenu } from "../MemberMenu";
import MemberDFormView from "../MemberDFormView";
import MemberSurveyView from "../MemberSurveyView";

import { TypeConstants } from "../../data/constants/typeApplication";

const MemberComponentView = (props) => {
  const { profile, userApplications, initialOnboarding, dForms, surveys, dFormsCategories, dFormsCategoriesRegister } =
    props;

  const [recentlySubmitted, setRecentlySubmitted] = useState(false);
  const [activeOnboarding, setActiveOnboarding] = useState(() => initialOnboarding);

  const unCompletedApplications = userApplications.filter((application) => {
    if (application.type === TypeConstants.DFORM) {
      return !(application?.status === "approved" || application?.status === "submitted");
    } else {
      return !application.finished_at;
    }
  });

  const onMenuChange = (onboarding) => {
    setActiveOnboarding(onboarding);
  };

  if (!activeOnboarding) {
    return <NpmSpin size={60} />;
  }

  const organization = profile?.permissions?.organization ?? "Surveys organization";

  return (
    <>
      <div className="member-menu" key={activeOnboarding.type}>
        <div className="member-menu-wrapper">
          <MemberMenu
            dforms={dForms}
            dFormsCategories={dFormsCategories}
            dFormsCategoriesRegister={dFormsCategoriesRegister}
            surveys={surveys}
            onboardings={userApplications}
            activeOnboarding={activeOnboarding}
            onMenuChange={onMenuChange}
          />
        </div>
      </div>
      <Row
        justify="center"
        className="member-block"
        align={activeOnboarding.type === TypeConstants.SURVEY ? "middle" : "top"}
      >
        <Col span={23} xxl={17}>
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
              userFirstName={profile.first_name}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default MemberComponentView;
