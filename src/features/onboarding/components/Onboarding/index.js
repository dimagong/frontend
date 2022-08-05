import React, { useEffect, useState } from "react";
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

//const { submitdFormRequest, setProfileOnboarding, submitdFormDataRequest } = appSlice.actions;

const OnboardingComponent = ({ profile, userApplications, initialOnboarding }) => {
  const [recentlySubmitted, setRecentlySubmitted] = useState(false);
  const [forceAppShow, setForceAppShow] = useState([]);
  const [appActiveOnboarding, setActiveAppOnboarding] = useState(null);

  useEffect(() => {
    setActiveAppOnboarding(initialOnboarding);
  }, [initialOnboarding]);

  const handleNavClick = (onboarding) => {
    setRecentlySubmitted(false);
    //dispatch(setProfileOnboarding({ ...onboarding }));
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
    //const availableApplication = profile?.onboarding || profile.onboardings[0];
    const availableApplication = appActiveOnboarding || profile.onboardings[0];

    if (!availableApplication) return;

    if (availableApplication?.tabId?.includes("form")) {
      return availableApplication.id + " form";
    } else {
      return availableApplication.id + " survey";
    }
  };

  const unCompletedApplications = userApplications.filter((application) => {
    if (application.tabId.includes("form")) {
      return !(application?.status === "approved" || application?.status === "submitted");
    } else {
      // For surveys
      return !application.finished_at;
    }
  });

  if (!appActiveOnboarding) {
    return <div>Onboarding not exist</div>;
  }

  return (
    <>
      <Row>
        <Col sm={12}>
          <NavMenu
            withIcons
            tabId="tabId"
            tabName={(application) => application?.title || application?.name}
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
                                //!!Mock data
                                // <OnboardingApp
                                //   profile={profile}
                                //   selectedForm={application}
                                //   setRecentlySubmitted={setRecentlySubmitted}
                                // />
                                <></>
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
                            onSurveyFinish={() => setRecentlySubmitted(true)}
                            selectedSurvey={application}
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
    </>
  );
};

export default OnboardingComponent;
