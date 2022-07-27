import React, { useEffect, useRef, useState } from "react";
import { CardBody, Card, Row, Col, TabContent, TabPane } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { selectLoading } from "app/selectors";

import { isEmpty } from "lodash";
import FormCreate from "components/FormCreate/FormCreate";
import OnboardingSurvey from "../../OnboardingSurvey";
import "./styles.scss";

import NavMenu from "components/NavMenu/NavMenu";

import Check from "assets/img/icons/check.png";

import StatusComponent from "../Components/StatusComponent";

//import appSlice from "app/slices/appSlice";

import {
  useSubmitdFormDataRequestMutation,
  useSubmitdFormPathRequestMutation,
  useAppsOnboardingIdQuery,
} from "api/Onboarding/prospectUserQuery";

import { findActiveAppOnboarding } from "./../../utils/findActiveAppOnboarding";
//const { submitdFormRequest, setProfileOnboarding, submitdFormDataRequest } = appSlice.actions;

const OnboardingComponent = ({ profile, userApplications }) => {
  const [recentlySubmitted, setRecentlySubmitted] = useState(false);
  const [forceAppShow, setForceAppShow] = useState([]);

  console.log("userApplications", userApplications);

  const initialAppOnboarding = () => {
    let appOnboardingInitial = [];
    if (profile && !profile.onboarding?.id) {
      appOnboardingInitial = findActiveAppOnboarding(userApplications) ?? [];
    } else if (profile?.onboarding?.id) {
      appOnboardingInitial = { ...profile.onboarding };
    }
    return appOnboardingInitial;
  };

  const [appOnboarding, setActiveAppOnboarding] = useState(initialAppOnboarding());
  // useEffect(() => {
  //   if(profile) setActiveAppOnboarding(activeAppOnboarding)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [activeAppOnboarding])

  //!Mock data
  // const {data: appOnboardingSelected}= useAppsOnboardingIdQuery({ id: appOnboarding.id }, { enabled: !!appOnboarding.id })
  const appOnboardingSelected = { ...appOnboarding };
  console.log("appOnboardingSelected", appOnboardingSelected);

  //const dispatch = useDispatch();
  const loading = useSelector(selectLoading);

  const isOnboarding = () => {
    //return userApplications && !!userApplications.length && profile.onboarding;
    return userApplications && !!userApplications.length && appOnboarding;
  };

  const debounceonSaveMutation = useSubmitdFormDataRequestMutation();
  const debounceOnSave = useRef((data, dForm) => {
    //dispatch(submitdFormDataRequest({ data, dForm }))
    debounceonSaveMutation.mutate({ data, dForm });
  });

  const submitdForm = useSubmitdFormPathRequestMutation();
  const submitOnboardingForm = (data) => {
    console.log("submitOnboardingForm data", data);
    setRecentlySubmitted(true);
    // dispatch(submitdFormRequest({ dForm: profile.onboarding.d_form, data }));
    submitdForm.mutate({ dForm: appOnboarding.d_form, data });
  };

  const handleNavClick = (onboarding) => {
    setRecentlySubmitted(false);
    //dispatch(setProfileOnboarding({ ...onboarding }));
    setActiveAppOnboarding({ ...onboarding });
  };

  const isDisabledSubmit = () => {
    // return ["user-lock", "hard-lock"].indexOf(profile.onboarding.d_form?.access_type) !== -1;
    return ["user-lock", "hard-lock"].indexOf(appOnboarding.d_form?.access_type) !== -1;
  };

  const isShowProtectedElements = (roles) => {
    return !roles.some((role) => ["corporate_manager", "member_firm_manager", "member", "admin"].indexOf(role) !== -1);
  };

  const commonFormProps = {
    isShowProtectedElements: isShowProtectedElements(profile.roles),
    fileLoader: true,
    fill: true,
    dForm: appOnboardingSelected.d_form,
    isStateConfig: false,
  };

  const formatTabs = (applications) => {
    return applications.map((application) => {
      if (application?.d_form) {
        // Check if onBoarding finished
        return {
          ...application,
          icon: application.d_form.status === "submitted" || application.d_form.status === "approved" ? Check : "null",
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

  const isShowStatus = (status) => {
    return status === "submitted" || status === "approved";
  };

  const showApplication = (onboardingId) => {
    setForceAppShow([...forceAppShow, onboardingId]);
  };

  const getActiveTab = () => {
    //const availableApplication = profile?.onboarding || profile.onboardings[0];
    const availableApplication = appOnboarding || profile.onboardings[0];

    if (!availableApplication) return;

    if (availableApplication?.d_form) {
      return availableApplication.id + " onboarding";
    } else {
      return availableApplication.id + " survey";
    }
  };

  const unCompletedApplications = userApplications.filter((application) => {
    if (application.d_form) {
      return !(application.status === "approved" || application.status === "submitted");
    } else {
      // For surveys
      return !application.finished_at;
    }
  });

  if (!isOnboarding()) {
    return <div>Onboarding not exist</div>;
  }

  return (
    <>
      <Row style={{ border: "2px solid red" }}>
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
                  if (application.d_form) {
                    // const commonFormProps = {
                    //   isShowProtectedElements: isShowProtectedElements(profile.roles),
                    //   fileLoader: true,
                    //   fill: true,
                    //   dForm: application.d_form,
                    //   isStateConfig: false,
                    // };

                    return (
                      <TabPane key={index} tabId={application.tabId}>
                        <div style={{ marginLeft: "-100px", marginRight: "100px", border: "4px solid black" }}>
                          <h2 className="onboarding-title">{application.d_form.name}</h2>
                          {!isEmpty(application) &&
                            (isShowStatus(application.d_form.status) && !~forceAppShow.indexOf(application.id) ? (
                              <StatusComponent
                                status={(recentlySubmitted && "recent") || application.d_form.status}
                                application={application}
                                isAllApplicationsCompleted={!unCompletedApplications.length}
                                onForceApplicationShow={() => showApplication(application.id)}
                              />
                            ) : application.d_form.access_type === "user-lock" ? (
                              <FormCreate
                                isShowErrors={true}
                                {...commonFormProps}
                                inputDisabled={true}
                                onSaveButtonHidden={isDisabledSubmit()}
                                onboardingUser={profile}
                                showSubmittedStatus
                              />
                            ) : (
                              <FormCreate
                                isShowErrors={true}
                                {...commonFormProps}
                                inputDisabled={false}
                                onSaveButtonHidden={true}
                                onboardingUser={profile}
                                onSubmit={(formData) => submitOnboardingForm(formData)}
                                onChange={(data) => {
                                  // setDebounced(true);
                                  debounceOnSave.current(data, application.d_form);
                                }}
                                updatedAtText={
                                  loading ? (
                                    "Saving"
                                  ) : (
                                    <div>
                                      <img style={{ marginTop: "-2px", fontSize: "15px" }} src={Check} alt="" /> Saved
                                    </div>
                                  )
                                }
                              />
                            ))}
                        </div>
                      </TabPane>
                    );
                  } else {
                    return (
                      <TabPane key={index} tabId={application.tabId}>
                        <div className="onboarding-title" />
                        {application.id === appOnboarding.id && (
                          // {application.id === profile.onboarding.id && (
                          <OnboardingSurvey
                            onSurveyFinish={() => setRecentlySubmitted(true)}
                            applicationData={application}
                            isRecentlySubmitted={recentlySubmitted}
                            isAllApplicationsCompleted={!unCompletedApplications.length}
                            appOnboarding={appOnboarding}
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
