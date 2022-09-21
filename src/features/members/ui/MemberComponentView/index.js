import "./styles.scss";

import React, { useEffect, useState } from "react";
import { Row, Col } from "antd";

import MemberMenuView from "./../MemberMenuView";
import Check from "assets/img/icons/check.png";

import MemberSurveyView from "../MemberSurveyView";
import MemberDFormView from "../MemberDFormView";
import { TypeConstants } from "./../../data/constants/typeApplication";

const MemberComponentView = ({ profile, userApplications, initialOnboarding, dForms, surveys }) => {
  const [forceAppShow, setForceAppShow] = useState([]);
  const [recentlySubmitted, setRecentlySubmitted] = useState(false);
  const [appActiveOnboarding, setActiveAppOnboarding] = useState(null);

  useEffect(() => {
    setActiveAppOnboarding(initialOnboarding);
    //eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialOnboarding.id]);

  const handleNavClick = (onboarding) => {
    setRecentlySubmitted(false);
    setActiveAppOnboarding(onboarding);
  };

  const formatTabs = (applications) => {
    return applications.map((application) => {
      if (application.tabId.includes("form")) {
        // Check if onBoarding finished
        return {
          ...application,
          icon: application?.status === "submitted" || application?.status === "approved" ? Check : "null",
        };
      } else {
        // Check is survey finished
        return {
          ...application,
          icon: application.finished_at ? Check : "null",
        };
      }
    });
  };

  const isShowStatus = (application) => {
    const status = application.d_form?.status || application?.status;
    return (status === "submitted" || status === "approved") && !~forceAppShow.indexOf(application.id);
  };

  const showApplication = (onboardingId) => {
    setForceAppShow([...forceAppShow, onboardingId]);
  };

  const getActiveTab = () => {
    const availableApplication = appActiveOnboarding || profile.onboardings[0];

    if (!availableApplication) return;

    if (availableApplication?.tabId?.includes("form")) {
      return availableApplication.id + " form";
    } else {
      return availableApplication.id + " survey";
    }
  };

  const unCompletedApplications = userApplications.filter((application) => {
    if (application.type === TypeConstants.DFORM) {
      return !(application?.status === "approved" || application?.status === "submitted");
    } else {
      return !application.finished_at;
    }
  });

  if (!appActiveOnboarding) {
    return <div>Onboarding not exist</div>;
  }

  const organization = profile?.permissions?.organization ?? "Surveys organization";
  return (
    <>
      <Row style={{ background: "#f4f4f4б", display: "flex", minHeight: "calc(100vh - 80px)" }}>
        <Col span={1}>
          <MemberMenuView dForms={dForms} surveys={surveys} setActiveAppOnboarding={setActiveAppOnboarding} />
        </Col>
        <Col
          span={23}
          style={{
            minHeight: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {appActiveOnboarding.type === TypeConstants.SURVEY && (
            <>
              <MemberSurveyView
                selectedSurveyId={appActiveOnboarding.id}
                setRecentlySubmitted={setRecentlySubmitted}
                isRecentlySubmitted={recentlySubmitted}
                isAllApplicationsCompleted={!unCompletedApplications.length}
                organization={organization}
              />
            </>
          )}
          {appActiveOnboarding.type === TypeConstants.DFORM && (
            <>
              <MemberDFormView
                profile={profile}
                selectedForm={appActiveOnboarding}
                setRecentlySubmitted={setRecentlySubmitted}
              />
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default MemberComponentView;
