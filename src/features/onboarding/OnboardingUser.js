import React, {useRef, useState, useEffect} from 'react'
import {
  CardHeader,
  CardBody,
  Card,
  CardTitle,
  Row,
  Col,
  Spinner,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  UncontrolledTooltip,
  Button,
} from 'reactstrap';
import {useDispatch, useSelector} from "react-redux";
import {
  selectProfile,
  selectLoading,
  selectManager,
} from "app/selectors";
import { selectOnboardingSurveys } from "app/selectors/userSelectors";
import classnames from "classnames"
import {isEmpty} from 'lodash'
import FormCreate from 'components/FormCreate/FormCreate'
import {debounce} from 'lodash';
import {CheckCircle, AlertCircle, Box, Clipboard, FileText, ChevronRight, ChevronDown} from 'react-feather';
import { createLoadingSelector } from "app/selectors/loadingSelector";
import OnboardingSurvey from "./OnboardingSurvey";
import './styles.scss'

import moment from "moment";

import FileInput from 'components/FormCreate/Custom/FileInput'

import TabsArrayOfObjects from 'components/Tabs/TabsArrayOfObjects'

import Check from 'assets/img/icons/check.png'

import Approved from './approved.svg'
import Submitted from './submitted.svg'
import Review from './onReview.svg'

import appSlice from 'app/slices/appSlice'

const {
  submitdFormRequest,
  submitdFormDataRequest,
  setProfileOnboarding,
  getUserByIdRequest,
  removeUserNotifyRequest,
  getAssignedSurveysForOnboardingRequest,
} = appSlice.actions;

const statusImages = {
  approved: {img: Approved, alt: "form approved"},
  submitted: {img: Review, alt: "form submitted"},
  recent: {img: Submitted, alt: "form recently submitted"},
}

const OnboardingUser = () => {
  const [recentlySubmitted, setRecentlySubmitted] = useState(false)
  const [forceAppShow, setForceAppShow] = useState([])


  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const loading = useSelector(selectLoading);
  const onboardingSurveys = useSelector(selectOnboardingSurveys);

  const isOnboardingSurveysLoading = useSelector(createLoadingSelector([getAssignedSurveysForOnboardingRequest.type], true));

  const [isDebounced, setDebounced] = useState(false);

  useEffect(() => {
    if (profile && !profile.onboarding?.id) {
      const activeOnboarding = profile.onboardings.find(onboarding => onboarding.d_form.status === "in-progress" || onboarding.d_form.status === "unsubmitted") || profile.onboardings[0]
      dispatch(setProfileOnboarding(activeOnboarding))
    }
  }, [profile]);

  const isOnboarding = () => {

    return profile && profile.onboardings && profile.onboardings.length || (onboardingSurveys && onboardingSurveys.length)
  };

  const debounceOnSave = useRef(debounce((data, dForm) => {
    dispatch(submitdFormDataRequest({dForm, data}));
    setDebounced(false);
  }, 1500));

  const submitOnboardingForm = data => {
    setRecentlySubmitted(true);
    dispatch(submitdFormRequest({dForm: profile.onboarding.d_form, data}))
  };

  const handleNavClick = onboarding => {
    setRecentlySubmitted(false)
    dispatch(setProfileOnboarding({...onboarding}))
  };

  const getStatus = (id, status) => {

    const prepearedId = 'dform-tooltip-' + id + '-' + status;

    const renderTooltip = (id, status) => {
      return <UncontrolledTooltip placement="top" target={id}>
        {status}
      </UncontrolledTooltip>
    };

    switch (status) {
      case 'rejected': {
        return <span id={prepearedId}><AlertCircle/>{renderTooltip(prepearedId, status)}</span>
      }
      case 'in-progress': {
        return <span id={prepearedId}><Clipboard/>{renderTooltip(prepearedId, status)}</span>
      }
      case 'approved': {
        return <span id={prepearedId}><CheckCircle/>{renderTooltip(prepearedId, status)}</span>
      }
      case 'submitted': {
        return <span id={prepearedId}><FileText/>{renderTooltip(prepearedId, status)}</span>
      }
      default:
        return <span id={prepearedId}><Box/>{renderTooltip(prepearedId, status)}</span>
    }
  };

  const isDisabledSubmit = () => {
    if (['user-lock', 'hard-lock'].indexOf(profile.onboarding.d_form.access_type) !== -1) {
      return true;
    }

    return false;
  };

  const isShowProtectedElements = (roles) => {
    return !roles.some(role => ['corporate_manager', 'member_firm_manager', 'member', 'admin'].indexOf(role) !== -1);
  };

  useEffect(() => {
    dispatch(getAssignedSurveysForOnboardingRequest());
  }, []);

  const formatTabs = (applications) => {
    return applications.map((application) => {
      if (application?.d_form) {
        // Check if onBoarding finished
        return {
          ...application,
          icon: (application.d_form.status === "submitted" || application.d_form.status === "approved") ? Check : "null"
        }
      } else {
        // Check is survey finished
        return {
          ...application,
          icon: application.finished_at ? Check : "null",
        }
      }
    })
  };


  const fetchFile = async (file) => {
    let response = await fetch(`${process.env.REACT_APP_API_URL}/api/file/${file.id}`, {
      headers: new Headers({
        'Authorization': 'Bearer ' + localStorage.getItem("token"),
      }),
    });
    let data = await response.blob();
    let metadata = {
      type: file.mime_type
    };

    return new File([data], file.name, metadata);
  }

  const saveBrochure = async (brochure) => {
    const file = await fetchFile(brochure)
    const blob = new Blob([file], {type: 'application/pdf'});
    if(window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, brochure.name);
    }
    else{
      const elem = window.document.createElement('a');
      elem.href = window.URL.createObjectURL(blob);
      elem.download = brochure.name;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
  }

  const proceedUserToOnboarding = () => {
    dispatch(removeUserNotifyRequest())
  }

  if (profile.notify && profile.notify_entity) {
    return (

      <div className={"welcome-onboarding"}>
        <div>
          <h1 className={"welcome-onboarding_title"}>
            {profile.notify_entity.intro_title}
          </h1>
        </div>
        <div className={"welcome-onboarding_intro-text"} dangerouslySetInnerHTML={{__html: profile.notify_entity.intro_text}} />
        <div className={"welcome-onboarding_download-button"}>
          <Button className={"welcome-onboarding_download-button_button"} onClick={() => {saveBrochure(profile.notify_entity.brochure)}}>
            Download the Welcome to {profile.permissions.organization} brochure <ChevronDown />
          </Button>
        </div>
        {!!isOnboarding() && (
          <div className={"welcome-onboarding_join-button"}>
            <Button className={"welcome-onboarding_join-button_button"} onClick={proceedUserToOnboarding}>
              Let's get started
              <ChevronRight className={"welcome-onboarding_join-button_button_chevron"} size={45} />
            </Button>
          </div>
        )}
      </div>


    )
  }

  const checkStatus = (status) => {
    return status === "submitted" || status === "approved"
  }

  const showApplication = (onboardingId) => {
    setForceAppShow([
      ...forceAppShow,
      onboardingId,
    ])
  }

  const renderStatus = (onboarding) => {
    const status = (recentlySubmitted && "recent") || onboarding.d_form.status;
    const isApplicationsCompleted = !!profile.onboardings.filter(({d_form}) => !(d_form.status === "approved" || d_form.status === "submitted")).length

    return (
      <div className={`status ${status}`}>
        <div className={"status_image"}>
          <img src={statusImages[status].img} alt={statusImages[status].alt} />
        </div>
        <div className={"status_description"}>

          {{submitted: <>
              <h1>Under Review</h1>
              <div>You have successfully submitted your information, and it is currently under review.</div>
              <div><span className="font-weight-bold">What happens next?</span><br />After our review, we will be in touch with next steps.</div>
            </>,
            approved: <>
              <h1>Success!</h1>
              <div>Our review of your information has completed.</div>
              <div>You can now continue via the ValidPath Portal and we will be in touch with you shortly to discuss  next steps.</div>
            </> ,
            recent: <>
              <h1>Submitted</h1>
              <div>Thank you.<br/><br/>Your information has been submitted.</div>
              <div>We will review your application and get back shortly.</div>
            </>,
          }[status]}

          {isApplicationsCompleted && (
            <div>
              {{submitted: "In the meantime, please continue with the remaining applications",
                approved: "Please continue with the remaining applications to complete your onboarding process.",
                recent: "In the meantime, please continue with the remaining applications to complete your onboarding process.",
              }[status]}
            </div>
          )}
          { status === "approved" ? (
            <div><br/>Thank you,<br/>The ValidPath Team</div>
          ) : (
            <div><br/>Sincerely,<br/>The ValidPath Team</div>
          )}
          <div className={"status_description_action"}>
            <Button className={"status_description_action_show-button"} onClick={() => showApplication(onboarding.id)} color="primary">
              View application
            </Button>
          </div>
        </div>
      </div>
    )
  };

  const renderSurveyStatus = (survey) => {
    const status = (recentlySubmitted && "recent") || "submitted";
    //**TODO rewrite check. Check if all d_forms and all surveys completed, currently checking only d_forms
    const isApplicationsCompleted = !!profile.onboardings.filter(({d_form}) => !(d_form.status === "approved" || d_form.status === "submitted")).length

    return (
      <div style={{marginLeft: "-100px", marginRight: "100px"}}>
      <div className={`status ${status}`}>
        <div className={"status_image"}>
          <img src={statusImages[status].img} alt={statusImages[status].alt} />
        </div>
        <div className={"status_description"}>

          {{submitted: <>
              <h1>Under Review</h1>
              <div>You have successfully submitted your information, and it is currently under review.</div>
              <div><span className="font-weight-bold">What happens next?</span><br />After our review, we will be in touch with next steps.</div>
            </>,
            approved: <>
              <h1>Success!</h1>
              <div>Our review of your information has completed.</div>
              <div>You can now continue via the ValidPath Portal and we will be in touch with you shortly to discuss  next steps.</div>
            </> ,
            recent: <>
              <h1>Submitted</h1>
              <div>Thank you.<br/><br/>Your information has been submitted.</div>
              <div>We will review your application and get back shortly.</div>
            </>,
          }[status]}

          {isApplicationsCompleted && (
            <div>
              {{submitted: "In the meantime, please continue with the remaining applications",
                approved: "Please continue with the remaining applications to complete your onboarding process.",
                recent: "In the meantime, please continue with the remaining applications to complete your onboarding process.",
              }[status]}
            </div>
          )}
          { status === "approved" ? (
            <div><br/>Thank you,<br/>The ValidPath Team</div>
          ) : (
            <div><br/>Sincerely,<br/>The ValidPath Team</div>
          )}
        </div>
      </div>
      </div>
    )
  };



  if (isOnboardingSurveysLoading) {
    return (
      <div className="d-flex justify-content-center pt-5">
        <Spinner color="primary" size={70}/>
      </div>
    );
  }

  let userApplications = [];

  if (isOnboarding()) {
    userApplications = [...(profile?.onboardings || []), ...(onboardingSurveys || [])];

    // Onboardings and surveys may have Id collisions, we add tabId property to prevent bugs
    userApplications = userApplications.map((application) => {
      return {
        ...application,
        tabId: `${application.id} ${application.d_form ? "onboarding" : "survey"}`
      };
    });

    userApplications = userApplications.sort((a, b) => {
      const firstArg = a?.d_form?.name || a.title;
      const secondArg = b?.d_form?.name || b.title;

      return firstArg.localeCompare(secondArg);
    });
  }

  const getActiveTab = () => {
    const availableApplicaiton = profile?.onboarding || profile.onboardings[0];
    if (availableApplicaiton.d_form) {
      return availableApplicaiton.id + " onboarding"
    } else {
      return availableApplicaiton.id + " survey"
    }
  };

  return (
    <div>
      {
        isOnboarding()
          ? (
            <Row style={{maxWidth: "1024px", margin: "0 auto"}}>
              <Col sm={12} style={{borderBottom: "1px solid rgba(115,103,240, 0.03)", marginBottom: "20px"}}>
                <Row>
                  <Col sm="12" md={{size: 10, offset: 1}}>
                    <div style={{marginBottom: "20px", marginLeft: "100px", marginRight: "100px"}}>
                      <TabsArrayOfObjects
                        withIcons
                        tabId="tabId"
                        tabName={(application) => application?.d_form?.name || application.title}
                        active={getActiveTab()} // TODO** handle set of active application
                        tabs={formatTabs(userApplications)}
                        onChange={(application) => {
                          handleNavClick(application)
                        }}
                        scrollOnStart
                      />
                    </div>

                  </Col>
                </Row>
              </Col>
              <Col sm="12" md={{size: 10, offset: 1}}>
                <Card style={{background: "transparent", boxShadow: "none"}}>

                  <CardBody className="pt-0 pl-0">

                    {
                      profile && userApplications && userApplications.length ?

                        <TabContent activeTab={getActiveTab()}>
                          {
                            userApplications.map((application, index) => {
                              if (application.d_form) {
                                return (
                                  <TabPane key={index} tabId={application.tabId}>
                                    <div style={{marginLeft: "-100px", marginRight: "100px"}}>
                                      {
                                        !isEmpty(application)
                                          ? checkStatus(application.d_form.status) && !~forceAppShow.indexOf(application.id) ? (
                                            renderStatus(application)
                                          ) : application.d_form.access_type === 'user-lock'
                                          ? <FormCreate
                                            isShowProtectedElements={isShowProtectedElements(profile.roles)}
                                            fileLoader={true}
                                            inputDisabled={true}
                                            fill={true}
                                            dForm={application.d_form}
                                            onSaveButtonHidden={isDisabledSubmit()}
                                            isStateConfig={false}
                                            onboardingUser={profile}
                                            showSubmittedStatus
                                          />
                                          : <FormCreate
                                            isShowProtectedElements={isShowProtectedElements(profile.roles)}
                                            onSubmit={(formData) => submitOnboardingForm(formData)}
                                            fileLoader={true}
                                            inputDisabled={false}
                                            fill={true}
                                            dForm={application.d_form}
                                            onSaveButtonHidden={true}
                                            onChange={(data) => {
                                              setDebounced(true);
                                              debounceOnSave.current(data, application.d_form)
                                            }}
                                            updatedAtText={
                                              loading
                                                ? "Saving"
                                                : (<div><img style={{marginTop: "-2px", fontSize: "15px"}} src={Check} alt=""/> Saved</div>)}
                                            isStateConfig={false}
                                          />

                                          : null
                                      }
                                    </div>
                                  </TabPane>
                                );
                              } else {
                                return (
                                  <TabPane key={index} tabId={application.tabId}>
                                    {application.id === profile.onboarding.id && (
                                      application.finished_at ? (
                                        renderSurveyStatus(application)
                                      ) : (
                                        <OnboardingSurvey
                                          onSurveyFinish={() => setRecentlySubmitted(true)}
                                          applicationData={application}
                                        />
                                      )

                                    )}
                                  </TabPane>
                                )
                              }
                            })
                          }
                        </TabContent>

                        : 'Onboarding not exist'
                    }
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )
          : 'Onboarding not exist'
      }
    </div>
  )
};


export default OnboardingUser;
