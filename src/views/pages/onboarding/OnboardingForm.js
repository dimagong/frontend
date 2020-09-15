import React from 'react'
import workflowService from '../../../services/workflow.service'
import {connect} from "react-redux"
import FormCreate from './FormCreate/FormCreate'
import {CardHeader, CardBody, Card, CardTitle, Row, Col, Spinner} from 'reactstrap';
import {toast, ToastContainer} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import "../../../assets/scss/plugins/extensions/toastr.scss"
import Form from "@rjsf/core";
import {debounce} from 'lodash';
import moment from "moment";
import userService from "../../../services/user.service";
import {TabContent, TabPane, Nav, NavItem, NavLink, UncontrolledTooltip} from "reactstrap"
import classnames from "classnames"
import { isEmpty, isEqual } from 'lodash'
import {bindActionCreators} from "redux";
import {setUserList} from "../../../redux/actions/user/userActions";
import {setInvitationsList} from "../../../redux/actions/user-management/InvitationsActions";
import {setNavBarHeadText} from '../../../redux/actions/navbar/navbarActions'
import { CheckCircle, AlertCircle, Box, Clipboard, FileText } from 'react-feather'

class OnboardingForm extends React.Component {

  state = {
    active: 0,
    updatedAtText: '',
    selectedOnboarding: {},
    isSaving: false
  };

  constructor(props) {
    super(props);
    this.debounceOnSave = debounce((formData) => {
      this.onSave(formData);
      this.setState({isSaving: false});
    }, 1500);

    this.props.setNavBarHeadText('Onboarding');
  }

  componentWillMount() {

  }

  isDisabledSubmit() {
    if (['user-lock', 'hard-lock'].indexOf(this.state.selectedOnboarding.d_form.access_type) !== -1) {
      return true;
    }

    return false;
  }

  componentDidMount() {
    // bug props in user not always here on hook
    if(this.props.user && this.props.user.onboardings && this.props.user.onboardings.length) {
      let defaultOnboarding = this.props.user.onboardings[0];
      this.setState({selectedOnboarding: defaultOnboarding, active: defaultOnboarding.id});
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {

  }

  async onSave(formData) {
    this.setState({
      updatedAtText: (
        <div className="d-flex">
          <div>Saving progress..</div>
          {<Spinner className="ml-1" color="success"/>}
        </div>
      )
    });
    const response = await workflowService.submitData(this.state.selectedOnboarding.d_form, formData);
    this.setState({updatedAtText: `Progress saved: ${moment(response.data.updated_at).format('YYYY-MM-DD HH:mm:ss')}`});
    toast.success('Success');
  }

  async submitOnboardingForm(formData) {
    this.setState({updatedAtText: "Saving progress"});
    const response = await workflowService.dFormSubmit(this.state.selectedOnboarding.d_form, formData);
    this.setState({updatedAtText: `Progress saved: ${moment(response.data.updated_at).format('YYYY-MM-DD HH:mm:ss')}`});
    toast.success('Success');
    window.location.reload();
  }

  getDefaultUpdatedAtText() {
    return `Progress saved: ${moment(this.state.selectedOnboarding.d_form.updated_at).format('YYYY-MM-DD HH:mm:ss')}`;
  }

  getStatus(id, status) {

    const prepearedId = 'dform-tooltip-' + id + '-' + status;

    const renderTooltip = (id, status) => {
      return <UncontrolledTooltip placement="top" target={id}>
        {status}
      </UncontrolledTooltip>
    };

    switch(status) {
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
      default: return <span id={prepearedId}><Box/>{renderTooltip(prepearedId, status)}</span>
    }
  }

  onboardingProcess() {
    if (this.state.selectedOnboarding.d_form.access_type === 'user-lock') {
      return <FormCreate
        reInit={(reInit, context) => {
          this.reInitForm = reInit.bind(context)
        }}
        isShowProtectedElements={userService.isShowProtectedElements(this.props.user)}
        fileLoader={true}
        inputDisabled={true}
        fill={true}
        dForm={this.state.selectedOnboarding.d_form}
        onSaveButtonHidden={this.isDisabledSubmit()}
        isStateConfig={false}
      ></FormCreate>
    } else {
      return <FormCreate
        reInit={(reInit, context) => {
          this.reInitForm = reInit.bind(context)
        }}
        isShowProtectedElements={userService.isShowProtectedElements(this.props.user)}
        onSubmit={(formData) => this.submitOnboardingForm(formData)}
        fileLoader={true}
        inputDisabled={false}
        fill={true}
        dForm={this.state.selectedOnboarding.d_form}
        onSaveButtonHidden={true}
        onChange={(formData) => {
          this.setState({isSaving: true});
          this.debounceOnSave(formData)
        }}
        updatedAtText={this.state.updatedAtText ? this.state.updatedAtText : this.getDefaultUpdatedAtText()}
        isStateConfig={false}
      ></FormCreate>
    }
  }

  toggle = tab => {
    if (this.state.active !== tab) {
      this.setState({active: tab})
    }
  }

  render() {

    return (
      <Row>
        <Col sm="12" md={{size: 10, offset: 1}}>
          <Nav pills className="nav-justified">
            {
              this.props.user && this.props.user.onboardings && this.props.user.onboardings.map(onboarding => {
                return (
                  <NavItem>
                    <NavLink
                      disabled={this.state.isSaving}
                      className={classnames({
                        active: this.state.active === onboarding.id
                      })}
                      onClick={() => {
                        this.toggle(onboarding.id);
                        this.setState({selectedOnboarding: onboarding})
                        this.reInitForm && this.reInitForm();
                      }}
                    >
                      {onboarding.d_form.name} {this.getStatus(onboarding.d_form.id, onboarding.d_form.status)}
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
                this.props.user && this.props.user.onboardings && this.props.user.onboardings.length ?
                  <div>
                    <TabContent activeTab={this.state.active}>
                      {
                        this.props.user.onboardings.map(onboarding => {
                          return (
                            <TabPane tabId={onboarding.id}>

                            </TabPane>
                          );
                        })
                      }
                    </TabContent>
                  </div>
                  :  'Onboarding not exist'
              }

              {!isEmpty(this.state.selectedOnboarding) ? this.onboardingProcess() : null}
              {/*{*/}
              {/*  Object.keys(this.props.user).length ?*/}

              {/*    isEmpty(this.state.selectedOnboarding) ?*/}
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
  }
}

const mapStateToProps = state => {
  return {
    user: state.user.profile
  }
};

const mapActionsToProps = (dispatch) => {
  return {
    setNavBarHeadText: bindActionCreators(setNavBarHeadText, dispatch),
  }
}

export default connect(mapStateToProps, mapActionsToProps)(OnboardingForm)
