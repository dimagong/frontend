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
import {selectProfile, selectLoading, selectManager} from "app/selectors";
import classnames from "classnames"
import {isEmpty} from 'lodash'
import FormCreate from 'components/FormCreate/FormCreate'
import {debounce} from 'lodash';
import {
  submitdFormRequest,
  submitdFormDataRequest,
  setProfileOnboarding,
  getUserByIdRequest,
  removeUserNotifyRequest,
} from "app/slices/appSlice";
import {CheckCircle, AlertCircle, Box, Clipboard, FileText, ChevronRight, ChevronDown} from 'react-feather';

import './styles.scss'

import moment from "moment";

import FileInput from 'components/FormCreate/Custom/FileInput'

import TabsArrayOfObjects from 'components/Tabs/TabsArrayOfObjects'
import {getProfileRequest} from "../../app/slices/appSlice";

import Check from 'assets/img/icons/check.png'

import Approved from './approved.svg'
import Submitted from './submitted.svg'
import Review from './onReview.svg'

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

  const [isDebounced, setDebounced] = useState(false);

  useEffect(() => {
    if (profile && !profile.onboarding?.id) {
      const activeOnboarding = profile.onboardings.find(onboarding => onboarding.d_form.status === "in-progress" || onboarding.d_form.status === "unsubmitted") || profile.onboardings[0]
      dispatch(setProfileOnboarding(activeOnboarding))
    }
  }, [profile]);

  const isOnboarding = () => {

    return profile && profile.onboardings && profile.onboardings.length
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
    return !roles.some(role => ['corporate_manager', 'member_firm_manager', 'adviser', 'admin'].indexOf(role) !== -1);
  };

  useEffect(() => {
    console.log("INITIALIZZED")
  }, [])

  const formatTabs = (onboardings) => {
    return onboardings.map((onboarding) => ({
      ...onboarding,
      icon: (onboarding.d_form.status === "submitted" || onboarding.d_form.status === "approved") ? Check : "null"
    }))
      // .filter((onBoarding) => onBoarding.d_form.status !== "approved")
  }


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

  if (profile.notify) {
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
            Download brochure <ChevronDown />
          </Button>
        </div>
        {!!isOnboarding() && (
          <div className={"welcome-onboarding_join-button"}>
            <Button className={"welcome-onboarding_join-button_button"} onClick={proceedUserToOnboarding}>
              Join a community of<br/> Independent Financial Adviser
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
              <div>You have successfully submitted this application, and it is currently under review.</div>
              <div>What happens next?<br />After review, we will be in touch with you on the progress of your application.</div>
            </>,
            approved: <>
              <h1>Success!</h1>
              <div>Your application review was successful!</div>
              <div>What happens next? <br />We will be in touch with you shortly with next steps, thank you for your patience.</div>
            </> ,
            recent: <>
              <h1>Submitted</h1>
              <div>Your application has been submitted for review successfully.</div>
              <div> What happens next? <br />We will review your application as soon as possible.</div>
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
          <div className={"status_description_action"}>
            <Button className={"status_description_action_show-button"} onClick={() => showApplication(onboarding.id)} color="primary">
              View application
            </Button>
          </div>
        </div>
      </div>
    )
  }

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
                        tabId="id"
                        tabName={(onboarding) => onboarding.d_form.name}
                        active={profile?.onboarding?.id || profile.onboardings[0].id}
                        tabs={formatTabs(profile?.onboardings)}
                        onChange={(onboarding) => {
                          handleNavClick(onboarding)
                        }}
                      />
                    </div>

                  </Col>
                </Row>
              </Col>
              <Col sm="12" md={{size: 10, offset: 1}}>
                <Card style={{background: "transparent", boxShadow: "none"}}>
                  {/*<CardHeader>*/}
                  {/*  <CardTitle>Onboarding</CardTitle>*/}
                  {/*</CardHeader>*/}

                  <CardBody className="pt-1 pl-0">

                    {
                      profile && profile.onboardings && profile.onboardings.length ?
                        <div style={{marginLeft: "-100px", marginRight: "100px"}}>
                          <TabContent activeTab={profile.onboarding?.id}>
                            {
                              profile.onboardings.map((onboarding, index) => {
                                return (
                                  <TabPane key={index} tabId={onboarding.id}>
                                    {
                                      !isEmpty(profile.onboarding)
                                        ? checkStatus(onboarding.d_form.status) && !~forceAppShow.indexOf(onboarding.id) ? (
                                          renderStatus(onboarding)
                                        ) : profile.onboarding.d_form.access_type === 'user-lock'
                                        ? <FormCreate
                                          // reInit={(reInit, context) => {
                                          //   this.reInitForm = reInit.bind(context)
                                          // }}
                                          isShowProtectedElements={isShowProtectedElements(profile.roles)}
                                          fileLoader={true}
                                          inputDisabled={true}
                                          fill={true}
                                          dForm={onboarding.d_form}
                                          onSaveButtonHidden={isDisabledSubmit()}
                                          isStateConfig={false}
                                          onboardingUser={profile}
                                          showSubmittedStatus
                                        />
                                        : <FormCreate
                                          // reInit={(reInit, context) => {
                                          //   this.reInitForm = reInit.bind(context)
                                          // }}
                                          isShowProtectedElements={isShowProtectedElements(profile.roles)}
                                          onSubmit={(formData) => submitOnboardingForm(formData)}
                                          fileLoader={true}
                                          inputDisabled={false}
                                          fill={true}
                                          dForm={onboarding.d_form}
                                          onSaveButtonHidden={true}
                                          onChange={(data) => {
                                            setDebounced(true);
                                            debounceOnSave.current(data, profile.onboarding.d_form)
                                          }}
                                          // updatedAtText={
                                          //   loading
                                          //     ? "Saving progress"
                                          //     : `Progress saved: ${moment(profile.onboarding.d_form.updated_at).format('YYYY-MM-DD HH:mm:ss')}`}
                                          updatedAtText={
                                            loading
                                              ? "Saving"
                                              : (<div><img style={{marginTop: "-2px", fontSize: "15px"}} src={Check} alt=""/> Saved</div>)}
                                          isStateConfig={false}
                                          // onboardingUser={profile}
                                        />
                                        : null
                                    }
                                  </TabPane>
                                );
                              })
                            }
                          </TabContent>
                        </div>
                        : 'Onboarding not exist'
                    }


                    {/*{*/}
                    {/*  Object.keys(this.props.user).length ?*/}

                    {/*    isEmpty(this.state.profile.onboarding) ?*/}
                    {/*      null*/}
                    {/*      :*/}
                    {/*      this.onboardingProcess()*/}
                    {/*    : 'loading..'*/}
                    {/*}*/}
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
