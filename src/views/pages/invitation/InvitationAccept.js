import React from 'react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardBody,
    FormGroup,
    Row,
    Col,
    Input,
    Form,
    Button,
    Label,
    FormFeedback
} from "reactstrap"
import "../../../assets/scss/plugins/forms/flatpickr/flatpickr.scss"
import InvitationService from '../../../services/invitation.service'
import { toast } from "react-toastify"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../assets/scss/plugins/extensions/toastr.scss"
import "../../../assets/scss/pages/users.scss"
import { connect } from "react-redux"
import SweetAlert from 'react-bootstrap-sweetalert';
import { history } from "../../../history"


class InvitationAccept extends React.Component {
    state = {
        user: null,
        invitationToken: null,
        errors: {},
        codeInputAlert: false,
        invitation: null,
        invitationRequest: {
            "code": "",
            "password": "",
            "password_confirmation": "",
        }
    };

    constructor(props) {
        super();
        this.state.invitationToken = props.match.params.id;

        this.responseStatuses = {
            mismatch: "Mismatch the code",
            codeSent: "Verification code sent to your email"
        }
    }

    confirmCode = async (value) => {
        this.setState((state, props) => ({ invitationRequest: { ...this.state.invitationRequest, code: value } }), () => {
            this.codeInputAlert(false);
            this.handleSubmit(false, true);
        });
    }

    codeInputAlert = (value) => {
        this.setState({ codeInputAlert: value });
    }

    async componentDidMount() {
        const response = await InvitationService.getInvitationByToken(this.state.invitationToken);
        if (response.status < 300) {
            this.setState({ invitation: response.data.data })
        }
    }

    async handleSubmit(event = false, triggeredByVerification = false) {
        event && event.preventDefault();

        try {
            await InvitationService.accept({
                password_confirmation: this.state.invitationRequest.password_confirmation,
                password: this.state.invitationRequest.password,
                invitation_token: this.state.invitationToken,
                code: this.state.invitationRequest.code,
            });
            toast.success("Successed")
            history.push("/");
        } catch (error) {
            if ('response' in error) {
                if (triggeredByVerification) {
                    toast.error(error.response.data.error.message)
                    return;
                };
                if (error.response.data.error.message === this.responseStatuses.mismatch) {
                    this.handleSubmit();
                    this.codeInputAlert(false);
                } else if (error.response.data.error.message === this.responseStatuses.codeSent) {
                    this.codeInputAlert(true);
                    toast.warn(error.response.data.error.message)
                } else {
                    toast.error(error.response.data.error.message)
                }

            }
        }
    }

    render() {

        return (
            <Row className="m-0 justify-content-center">
                <Col
                    sm="12"
                    xl="5"
                    lg="6"
                    md="6"
                    className="d-flex justify-content-center"
                >
                    <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
                        <Row className="m-0">
                            <Col lg="12" md="12" className="p-0">
                                <Card className="rounded-0 mb-0 px-2 login-tabs-container">
                                    <CardHeader className="pb-1">
                                        <CardTitle>
                                            <h4 className="mb-0">Invitation request form</h4>
                                        </CardTitle>
                                    </CardHeader>
                                    {/* <p className="px-2 auth-title">
                                        Welcome back, please login to your account.
                                    </p> */}
                                    <CardBody className="pt-1">
                                        <Form action="/" onSubmit={(event) => this.handleSubmit(event)}>
                                            <FormGroup className="form-label-group position-relative">
                                                <Input
                                                    value={this.state.invitationRequest.password}
                                                    onChange={(event) => { this.setState({ invitationRequest: { ...this.state.invitationRequest, password: event.target.value } }) }}
                                                    type="password"
                                                    placeholder="Password"
                                                    required
                                                    {...{ invalid: 'password' in this.state.errors }}
                                                />
                                                <Label>Password confirmation</Label>
                                                <FormFeedback>Oh noes! that name is already taken</FormFeedback>
                                            </FormGroup>
                                            <FormGroup className="form-label-group position-relative">
                                                <Input
                                                    value={this.state.invitationRequest.password_confirmation}
                                                    onChange={(event) => { this.setState({ invitationRequest: { ...this.state.invitationRequest, password_confirmation: event.target.value } }) }}
                                                    type="password"
                                                    placeholder="Password confirmation"
                                                    required
                                                    {...{ invalid: 'password confirmation' in this.state.errors }}
                                                />
                                                <Label>Password</Label>
                                                <FormFeedback>Oh noes! that name is already taken</FormFeedback>
                                            </FormGroup>
                                            <div className="d-flex justify-content-end">
                                                <Button.Ripple color="primary" type="submit">
                                                    Submit
                                                </Button.Ripple>
                                            </div>
                                        </Form>

                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                <ToastContainer />
                <SweetAlert title="Code Verification"
                    input
                    show={this.state.codeInputAlert}
                    placeHolder="Your code"
                    onConfirm={(response) => this.confirmCode(response)}
                >
                    <p className="sweet-alert-text">
                        Please check your email address and enter the code
                                        </p>
                </SweetAlert>
            </Row>
        )
    }
}

const mapStateToProps = state => {
    return {
    }
}
const mapActionsToProps = (dispatch) => {
    return {

    }
}
export default connect(mapStateToProps, mapActionsToProps)(InvitationAccept)