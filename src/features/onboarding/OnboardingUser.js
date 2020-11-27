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
  UncontrolledTooltip
} from 'reactstrap';
import {useDispatch, useSelector} from "react-redux";
import {selectProfile, selectLoading, selectManager} from "app/selectors";
import classnames from "classnames"
import {toast, ToastContainer} from 'react-toastify';
import {isEmpty} from 'lodash'
import FormCreate from 'components/FormCreate/FormCreate'
import {debounce} from 'lodash';
import {submitdFormRequest, submitdFormDataRequest, setProfileOnboarding,   getUserByIdRequest} from "app/slices/appSlice";
import {CheckCircle, AlertCircle, Box, Clipboard, FileText} from 'react-feather';
import moment from "moment";
import {getProfileRequest} from "../../app/slices/appSlice";

const OnboardingUser = () => {
  const [active, setActive] = useState(0);
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const loading = useSelector(selectLoading);
  const isInitialized = useRef(false);
  const [isDebounced, setDebounced] = useState(false);

  useEffect(() => {
    if (profile && profile.onboardings && profile.onboardings.length && !isInitialized.current) {
      isInitialized.current = true;
      profile.onboarding && dispatch(setProfileOnboarding(profile.onboardings[0]))
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
    dispatch(submitdFormRequest({dForm: profile.onboarding.d_form, data}))
  };

  const toggle = tab => {
    if (active !== tab) {
      setActive(tab)
    }
  };
  const handleNavClick = onboarding => {
    toggle(onboarding.id);

    dispatch(setProfileOnboarding(onboarding))
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

  return (
    <div>
      {
        isOnboarding()
          ? (
            <Row>
              <Col sm="12" md={{size: 10, offset: 1}}>
                <Nav pills className="nav-justified">
                  {
                    profile.onboardings.map((onboarding, index) => {
                      return (
                        <NavItem>
                          <NavLink
                            disabled={isDebounced || loading}
                            className={classnames({
                              active: active === index
                            })}
                            onClick={() => {
                              handleNavClick(onboarding)
                            }}
                          >
                            {onboarding.d_form.name} {getStatus(onboarding.d_form.id, onboarding.d_form.status)}
                          </NavLink>
                        </NavItem>
                      );
                    })
                  }
                </Nav>
              </Col>
              <Col sm="12" md={{size: 10, offset: 1}}>
                <Card>
                  {/*<CardHeader>*/}
                  {/*  <CardTitle>Onboarding</CardTitle>*/}
                  {/*</CardHeader>*/}

                  <CardBody className="pt-1">
                    {
                      profile && profile.onboardings && profile.onboardings.length ?
                        <div>
                          <TabContent activeTab={active}>
                            {
                              profile.onboardings.map((onboarding, index) => {
                                return (
                                  <TabPane tabId={index}>
                                    {!isEmpty(profile.onboarding)
                                      ? profile.onboarding.d_form.access_type === 'user-lock'
                                        ? <FormCreate
                                          // reInit={(reInit, context) => {
                                          //   this.reInitForm = reInit.bind(context)
                                          // }}
                                          isShowProtectedElements={isShowProtectedElements(profile.roles)}
                                          fileLoader={true}
                                          inputDisabled={true}
                                          fill={true}
                                          dForm={profile.onboarding.d_form}
                                          onSaveButtonHidden={isDisabledSubmit()}
                                          isStateConfig={false}
                                        ></FormCreate>
                                        : <FormCreate
                                          // reInit={(reInit, context) => {
                                          //   this.reInitForm = reInit.bind(context)
                                          // }}
                                          isShowProtectedElements={isShowProtectedElements(profile.roles)}
                                          onSubmit={(formData) => submitOnboardingForm(formData)}
                                          fileLoader={true}
                                          inputDisabled={false}
                                          fill={true}
                                          dForm={profile.onboarding.d_form}
                                          onSaveButtonHidden={true}
                                          onChange={(data) => {
                                            setDebounced(true);
                                            debounceOnSave.current(data, profile.onboarding.d_form)
                                          }}
                                          updatedAtText={
                                            loading
                                              ? "Saving progress"
                                              : `Progress saved: ${moment(profile.onboarding.d_form.updated_at).format('YYYY-MM-DD HH:mm:ss')}`}
                                          isStateConfig={false}
                                        ></FormCreate>
                                      : null}
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
              <ToastContainer></ToastContainer>
            </Row>
          )
          : 'Onboarding not exist'
      }
    </div>
  )
};


export default OnboardingUser;
