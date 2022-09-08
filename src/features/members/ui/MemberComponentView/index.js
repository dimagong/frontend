import "./styles.scss";

import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { CardBody, Card, TabContent, TabPane } from "reactstrap";
import { Row, Col } from "antd";

import NavMenu from "components/NavMenu/NavMenu";
import MemberMenuView from "./../MemberMenuView";
import Check from "assets/img/icons/check.png";

import NpmCardSurvey from "../MemberCardPassSurveyView";
import MemberSurveyView from "../MemberSurveyView";
import { TypeConstants } from "./../../data/constants/typeApplication";

//import OnboardingSurvey from "../../OnboardingSurvey";
import StatusComponent from "../../../onboarding/components/Components/StatusComponent";
//"../Components/StatusComponent";
import OnboardingApp from "../../../onboarding/components/OnboardingApp";
//"./../../components/OnboardingApp";

const MemberComponentView = ({ profile, userApplications, initialOnboarding, dForms, surveys }) => {
  const [forceAppShow, setForceAppShow] = useState([]);
  const [recentlySubmitted, setRecentlySubmitted] = useState(false);
  const [appActiveOnboarding, setActiveAppOnboarding] = useState(null);
  console.log("appActiveOnboarding", appActiveOnboarding);
  console.log("profile", profile);

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
          {/*
          <Col sm={12}>
          <NavMenu
            withIcons
            tabId="tabId"
            tabName={(application) => application?.title || application?.name}
            active={getActiveTab()}
            tabs={formatTabs(userApplications)}
            onChange={(application) => handleNavClick(application)}
          />
          </Col> */}
        </Col>
        <Col
          span={23}
          style={{
            height: "100%",
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
              <div style={{ marginLeft: "-100px", marginRight: "100px" }}>
                <h2 className="onboarding-title">{appActiveOnboarding?.title || appActiveOnboarding?.name}</h2>
                {!isEmpty(appActiveOnboarding) &&
                  (isShowStatus(appActiveOnboarding) ? (
                    <StatusComponent
                      status={(recentlySubmitted && "recent") || appActiveOnboarding?.status}
                      application={appActiveOnboarding}
                      isAllApplicationsCompleted={!unCompletedApplications.length}
                      onForceApplicationShow={() => showApplication(appActiveOnboarding.id)}
                    />
                  ) : (
                    <OnboardingApp
                      profile={profile}
                      selectedForm={appActiveOnboarding}
                      setRecentlySubmitted={setRecentlySubmitted}
                    />
                  ))}
              </div>
            </>
          )}
        </Col>
      </Row>

      {/* 
         <Row style={{ maxWidth: "1024px", marginLeft: "95px" }}>
         <Col sm="12" md={{ size: 10, offset: 1 }}>
          <Card style={{ background: "transparent", boxShadow: "none" }}>
            <CardBody className="pt-0 pl-0">
              <TabContent activeTab={getActiveTab()}>
                {userApplications.map((application, index) => {
                  if (application.tabId.includes("form")) {
                    return (
                      <TabPane key={index} tabId={application.tabId}>
                        <div style={{ marginLeft: "-100px", marginRight: "100px" }}>
                          <h2 className="onboarding-title">{application?.title || application?.name}</h2>
                          {!isEmpty(application) &&
                            (isShowStatus(application) ? (
                              <StatusComponent
                                status={(recentlySubmitted && "recent") || application?.status}
                                application={application}
                                isAllApplicationsCompleted={!unCompletedApplications.length}
                                onForceApplicationShow={() => showApplication(application.id)}
                              />
                            ) : (
                              application.id === appActiveOnboarding?.id && (
                                <OnboardingApp
                                  profile={profile}
                                  selectedForm={application}
                                  setRecentlySubmitted={setRecentlySubmitted}
                                />
                              )
                            ))}
                        </div>
                      </TabPane>
                    );
                  } else {
                    return (
                      <TabPane key={index} tabId={application.tabId}>
                        <div className="onboarding-title" />
                        {application.id === appActiveOnboarding?.id && (
                          <OnboardingSurvey
                            selectedSurveyId={appActiveOnboarding.id}
                            setRecentlySubmitted={setRecentlySubmitted}
                            isRecentlySubmitted={recentlySubmitted}
                            isAllApplicationsCompleted={!unCompletedApplications.length}
                          />
                        )}
                      </TabPane>
                    );
                  }
                })}
              </TabContent>
            </CardBody>
          </Card>
        </Col> 
          </Row>
        */}
    </>
  );
};

export default MemberComponentView;
