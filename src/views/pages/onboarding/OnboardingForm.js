import React from 'react'
import workflowService from '../../../services/workflow.service'
import { connect } from "react-redux"
import FormCreate from './FormCreate/FormCreate'
import { CardHeader, CardBody, Card, CardTitle, Row, Col } from 'reactstrap';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
import "../../../assets/scss/plugins/extensions/toastr.scss"

class OnboardingForm extends React.Component {

    state = {

    }

    constructor(props) {
        super();


    }

    componentWillMount() {

    }

    isDisabledSubmit() {
        if (['user-lock', 'hard-lock'].indexOf(this.props.user.onboarding.d_form.access_type) !== -1) {
            return true;
        }

        return false;
    }

    async onSave(formData) {
        await workflowService.submitData(this.props.user.onboarding.d_form, formData);
        toast.success('Success');
    }

    async submitOnboardingForm(formData) {
        await workflowService.dFormSubmit(this.props.user.onboarding.d_form, formData);
        toast.success('Success');
        window.location.reload();
    }

    onboardingProcess() {
        if (this.props.user.onboarding.d_form.access_type === 'user-lock') {
            return <FormCreate
                inputDisabled={true}
                fill={true}
                isSubmitHidden={this.isDisabledSubmit()}
                submitOnboardingForm={(formData) => this.submitOnboardingForm(formData)}
                dForm={this.props.user.onboarding.d_form}
                isStateConfig={false}
            ></FormCreate>
        } else {
            return <FormCreate
                submitOnboardingForm={(formData) => this.onSave(formData)}
                fill={true}
                dForm={this.props.user.onboarding.d_form}
                isStateConfig={false}
                onSubmit={(formData) => this.submitOnboardingForm(formData)}
            ></FormCreate>
        }
    }

    render() {

        return (
            <Row>
                <Col md="7">
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
}

export default connect(mapStateToProps)(OnboardingForm)
