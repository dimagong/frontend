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

class OnboardingForm extends React.Component {

  state = {
    updatedAtText: ''
  };

  constructor(props) {
    super(props);
    this.debounceOnSave = debounce((formData) => {
      this.onSave(formData)
    }, 1500);
  }

  componentWillMount() {

  }

  isDisabledSubmit() {
    if (['user-lock', 'hard-lock'].indexOf(this.props.user.onboarding.d_form.access_type) !== -1) {
      return true;
    }

    return false;
  }

  componentDidMount() {

  }

  async onSave(formData) {
    this.setState({
      updatedAtText: (
        <div className="d-flex">
          <div>Saving progress..</div>
          {<Spinner className="ml-1" color="success" />}
        </div>
      )
    });
    const response = await workflowService.submitData(this.props.user.onboarding.d_form, formData);
    this.setState({updatedAtText: `Progress saved: ${moment(response.data.updated_at).format('YYYY-MM-DD HH:mm:ss')}`});
    toast.success('Success');
  }

  async submitOnboardingForm(formData) {
    this.setState({updatedAtText: "Saving progress"});
    const response = await workflowService.dFormSubmit(this.props.user.onboarding.d_form, formData);
    this.setState({updatedAtText: `Progress saved: ${moment(response.data.updated_at).format('YYYY-MM-DD HH:mm:ss')}`});
    toast.success('Success');
    window.location.reload();
  }

  getDefaultUpdatedAtText() {
    return `Progress saved: ${moment(this.props.user.onboarding.d_form.updated_at).format('YYYY-MM-DD HH:mm:ss')}`;
  }

  onboardingProcess() {
    if (this.props.user.onboarding.d_form.access_type === 'user-lock') {
      return <FormCreate
        fileLoader={true}
        inputDisabled={true}
        fill={true}
        onSaveButtonHidden={this.isDisabledSubmit()}
        dForm={this.props.user.onboarding.d_form}
        isStateConfig={false}
      ></FormCreate>
    } else {
      return <FormCreate
        fileLoader={true}
        onSubmit={(formData) => this.submitOnboardingForm(formData)}
        fill={true}
        dForm={this.props.user.onboarding.d_form}
        isStateConfig={false}
        onSaveButtonHidden={true}
        onChange={(formData) => this.debounceOnSave(formData)}
        updatedAtText={this.state.updatedAtText ? this.state.updatedAtText : this.getDefaultUpdatedAtText()}
      ></FormCreate>
    }
  }

  render() {

    return (
      <Row>
        <Col sm="12" md={{ size: 10, offset: 1 }}>
          <Card>
            <CardHeader>
              <CardTitle>Onboarding</CardTitle>
            </CardHeader>

            <CardBody>
              {
                Object.keys(this.props.user).length ?

                  !this.props.user.onboarding ?
                    'Onboarding not exist'
                    :
                    this.onboardingProcess()
                  : 'loading..'
              }
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

export default connect(mapStateToProps)(OnboardingForm)
