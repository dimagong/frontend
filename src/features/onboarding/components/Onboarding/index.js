import React, { useState } from "react";
import { CardBody, Card, Row, Col, TabContent, TabPane } from "reactstrap";
//import { useSelector } from "react-redux";
//import { selectLoading } from "app/selectors";
import { isEmpty } from "lodash";
import OnboardingSurvey from "../../OnboardingSurvey";
import "./styles.scss";
import NavMenu from "components/NavMenu/NavMenu";
import Check from "assets/img/icons/check.png";
import StatusComponent from "../Components/StatusComponent";
import OnboardingApp from "./../OnboardingApp";

//import appSlice from "app/slices/appSlice";

import { useAppsOnboardingIdQuery } from "api/Onboarding/prospectUserQuery";

import { findActiveAppOnboarding, initialAppOnboarding } from "./../../utils/findActiveAppOnboarding";
//const { submitdFormRequest, setProfileOnboarding, submitdFormDataRequest } = appSlice.actions;

const useOnboarding = (recentlySubmittedData, forceAppShowData, appActiveOnboardingData) => {
  const [recentlySubmitted, setRecentlySubmitted] = useState(false);
  const [forceAppShow, setForceAppShow] = useState([]);
  const [appActiveOnboarding, setActiveAppOnboarding] = useState(null);
  if (recentlySubmittedData) setRecentlySubmitted(recentlySubmittedData);
  if (forceAppShowData) setForceAppShow(forceAppShowData);
  if (appActiveOnboardingData) setActiveAppOnboarding(appActiveOnboardingData);
  return [recentlySubmitted, forceAppShow, appActiveOnboarding];
};

const OnboardingComponent = ({ profile, userApplications }) => {
  const [recentlySubmitted, setRecentlySubmitted] = useState(false);
  const [forceAppShow, setForceAppShow] = useState([]);

  //const [recentlySubmitted] = useOnboarding(true);
  console.log("recentlySubmitted", recentlySubmitted);
  console.log("userApplications", userApplications);

  const [appActiveOnboarding, setActiveAppOnboarding] = useState(initialAppOnboarding(profile, userApplications));

  //!Mock data
  // const {data: appOnboardingSelected}= useAppsOnboardingIdQuery({ id: appOnboarding.id }, { enabled: !!appOnboarding.id })
  const appOnboardingSelected = { ...appActiveOnboarding };
  console.log("appOnboardingSelected", appOnboardingSelected);

  const handleNavClick = (onboarding) => {
    setRecentlySubmitted(false);
    //dispatch(setProfileOnboarding({ ...onboarding }));
    setActiveAppOnboarding({ ...onboarding });
  };

  const formatTabs = (applications) => {
    return applications.map((application) => {
      if (application?.d_form || application.tabId.includes("onboarding")) {
        // Check if onBoarding finished
        return {
          ...application,
          icon:
            application.status === "submitted" ||
            application.status === "approved" ||
            application.d_form.status === "submitted" ||
            application.d_form.status === "approved"
              ? Check
              : "null",
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
    const status = application.d_form?.status || application.status;
    return (status === "submitted" || status === "approved") && !~forceAppShow.indexOf(application.id);
  };

  const showApplication = (onboardingId) => {
    setForceAppShow([...forceAppShow, onboardingId]);
  };

  const getActiveTab = () => {
    //const availableApplication = profile?.onboarding || profile.onboardings[0];
    const availableApplication = appActiveOnboarding || profile.onboardings[0];

    if (!availableApplication) return;

    if (availableApplication?.d_form || availableApplication.tabId.includes("onboarding")) {
      return availableApplication.id + " onboarding";
    } else {
      return availableApplication.id + " survey";
    }
  };

  const unCompletedApplications = userApplications.filter((application) => {
    if (application.tabId.includes("onboarding")) {
      return !(application.status === "approved" || application.status === "submitted");
    } else {
      // For surveys
      return !application.finished_at;
    }
  });

  if (!appActiveOnboarding) {
    return <div>Onboarding not exist</div>;
  }

  console.log("forceAppShow", forceAppShow);
  return (
    <>
      <Row>
        <Col sm={12}>
          <NavMenu
            withIcons
            tabId="tabId"
            tabName={(application) => application?.d_form?.name || application.title}
            active={getActiveTab()}
            tabs={formatTabs(userApplications)}
            onChange={(application) => {
              handleNavClick(application);
            }}
          />
        </Col>
      </Row>
      <Row style={{ maxWidth: "1024px", marginLeft: "95px" }}>
        <Col sm="12" md={{ size: 10, offset: 1 }}>
          <Card style={{ background: "transparent", boxShadow: "none" }}>
            <CardBody className="pt-0 pl-0">
              <TabContent activeTab={getActiveTab()}>
                {userApplications.map((application, index) => {
                  if (application.tabId.includes("onboarding")) {
                    return (
                      <TabPane key={index} tabId={application.tabId}>
                        <div style={{ marginLeft: "-100px", marginRight: "100px", border: "4px solid black" }}>
                          <h2 className="onboarding-title">{application.d_form?.name || application.name}</h2>
                          {!isEmpty(application) &&
                            (isShowStatus(application) ? (
                              <StatusComponent
                                status={
                                  (recentlySubmitted && "recent") || application.d_form?.status || application.status
                                }
                                application={application}
                                isAllApplicationsCompleted={!unCompletedApplications.length}
                                onForceApplicationShow={() => showApplication(application.id)}
                              />
                            ) : appOnboardingSelected.d_form ? (
                              <OnboardingApp
                                profile={profile}
                                appOnboardingSelected={appOnboardingSelected}
                                setRecentlySubmitted={setRecentlySubmitted}
                              />
                            ) : null)}
                        </div>
                      </TabPane>
                    );
                  } else {
                    return (
                      <TabPane key={index} tabId={application.tabId}>
                        <div className="onboarding-title" />
                        {application.id === appActiveOnboarding.id && (
                          // {application.id === profile.onboarding.id && (
                          <OnboardingSurvey
                            onSurveyFinish={() => setRecentlySubmitted(true)}
                            applicationData={application}
                            isRecentlySubmitted={recentlySubmitted}
                            isAllApplicationsCompleted={!unCompletedApplications.length}
                            appOnboarding={appActiveOnboarding}
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
    </>
  );
};

export default OnboardingComponent;
