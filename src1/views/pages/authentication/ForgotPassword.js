import React from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  FormGroup,
  Form,
  Input,
  Button,
  Label,
  Spinner
} from "reactstrap"
import fgImg from "../../../assets/img/pages/forgot-password.png"
import {history} from "../../../history"
import "../../../assets/scss/pages/authentication.scss"
import PasswordService from "../../../services/password.service"
import {ToastContainer, toast} from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../assets/scss/plugins/extensions/toastr.scss"
import {debounce} from "lodash";

const STEP_FORGOT = 'forgot';
const STEP_FORGOT_SUCCESS = 'forgot-success';
const STEP_RECOVERY = 'recovery';
const STEP_RECOVERY_SUCCESS = 'recovery-success';
const STEP_LOADING = 'loading';

class ForgotPassword extends React.Component {
  state = {
    firstStep: null,
    step: STEP_FORGOT,
    email: '',
    token: '',
    password: '',
    password_confirmation: ''
  };

  async forgotPasswordSubmit(event) {
    event.preventDefault();
    try {
      this.setState({step: STEP_LOADING});
      await PasswordService.forgot(this.state.email);
      this.setState({step: STEP_FORGOT_SUCCESS})
      toast.success('Success');
    } catch (exception) {
      setTimeout(() => {
        this.setState({step: this.state.firstStep});
        toast.error('Error');
      }, 300);

    }
  }

  async recoveryPasswordSubmit(event) {
    event.preventDefault();
    this.setState({step: STEP_LOADING});
    try {
      await PasswordService.reset(this.state.email, this.state.token, this.state.password, this.state.password_confirmation);
      this.setState({step: STEP_RECOVERY_SUCCESS});
      toast.success('Success');
    } catch (exception) {
      setTimeout(() => {
        this.setState({step: this.state.firstStep});
        toast.error('Error');
      }, 300);

    }
  }

  constructor(props) {
    super(props);
    const search = window.location.search;
    const params = new URLSearchParams(search);
    if (params.has('token') && params.has('email')) {
      this.state.step = STEP_RECOVERY;
      this.state.token = params.get('token');
      this.state.email = params.get('email');
    }

    this.state.firstStep = this.state.step;
  }

  componentDidMount() {

  }

  changeEmail(email) {
    this.setState({email});
  }

  render() {
    return (
      <Row className="m-0 justify-content-center">
        <Col
          sm="8"
          xl="7"
          lg="10"
          md="8"
          className="d-flex justify-content-center"
        >
          <Card className="bg-authentication rounded-0 mb-0 w-100">
            <Row className="m-0">
              <Col
                lg="6"
                className="d-lg-block d-none text-center align-self-center"
              >
                <img src={fgImg} alt="fgImg"/>
              </Col>
              <Col lg="6" md="12" className="p-0">
                {

                  this.state.step === STEP_LOADING ?
                    <Card className="rounded-0 mb-0 px-2 py-1 h-100">
                      <CardHeader className="pb-1">
                        <CardTitle>
                          <h4 className="mb-0">Sending..</h4>
                        </CardTitle>
                      </CardHeader>
                      <CardBody className="pt-1 pb-0">
                        <div className="text-center">
                          <Spinner color="primary"/>
                        </div>
                      </CardBody>
                    </Card>
                    : null
                }
                {

                  this.state.step === STEP_FORGOT_SUCCESS ?
                    <Card className="rounded-0 mb-0 px-2 py-1 h-100">
                      <CardHeader className="pb-1">
                        <CardTitle>
                          <h4 className="mb-0">Password recovery link was successfully sent to your email address</h4>
                        </CardTitle>
                      </CardHeader>
                      <CardBody className="pt-1 pb-0">
                      </CardBody>
                    </Card> : null
                }
                {
                  this.state.step === STEP_RECOVERY_SUCCESS ?
                    <Card className="rounded-0 mb-0 px-2 py-1 h-100">
                      <CardHeader className="pb-1">
                        <CardTitle>
                          <h4 className="mb-0">Password changed successfully</h4>
                        </CardTitle>
                      </CardHeader>
                      <CardBody className="pt-1 pb-0">
                        <div className="float-md-left d-block mb-1">
                          <Button.Ripple
                            color="primary"
                            outline
                            className="px-75 btn-block"
                            onClick={() => history.push("/login")}
                          >
                            Back to Login
                          </Button.Ripple>
                        </div>
                      </CardBody>
                    </Card>
                    : null
                }
                {
                  this.state.step === STEP_RECOVERY ?

                    <Card className="rounded-0 mb-0 px-2 py-1">
                      <CardHeader className="pb-1">
                        <CardTitle>
                          <h4 className="mb-0">Recover your password</h4>
                        </CardTitle>
                      </CardHeader>
                      <p className="px-2 auth-title">
                        Please enter your new password
                      </p>
                      <CardBody className="pt-1 pb-0">
                        <Form>
                          <FormGroup className="form-label-group">
                            <Input type="text" placeholder="Email" required value={this.state.email}
                                   disabled
                                   onChange={(event) => this.changeEmail(event.target.value)}/>
                            <Label>Email</Label>
                          </FormGroup>
                          <FormGroup className="form-label-group">
                            <Input type="password" placeholder="Password" required value={this.state.password}
                                   onChange={(event) => this.setState({password: event.target.value})}/>
                            <Label>Password</Label>
                          </FormGroup>
                          <FormGroup className="form-label-group">
                            <Input type="password" placeholder="Password confirmation" required
                                   value={this.state.password_confirmation}
                                   onChange={(event) => this.setState({password_confirmation: event.target.value})}/>
                            <Label>Password confirmation</Label>
                          </FormGroup>
                          <div className="float-md-left d-block mb-1">
                            <Button.Ripple
                              color="primary"
                              outline
                              className="px-75 btn-block"
                              onClick={() => history.push("/login")}
                            >
                              Back to Login
                            </Button.Ripple>
                          </div>
                          <div className="float-md-right d-block mb-1">
                            <Button.Ripple
                              color="primary"
                              type="submit"
                              className="px-75 btn-block"
                              onClick={event => {
                                this.recoveryPasswordSubmit(event);
                              }}
                            >
                              Change password
                            </Button.Ripple>
                          </div>
                        </Form>
                      </CardBody>
                    </Card>
                    : null
                }

                {
                  this.state.step === STEP_FORGOT ?


                    <Card className="rounded-0 mb-0 px-2 py-1">
                      <CardHeader className="pb-1">
                        <CardTitle>
                          <h4 className="mb-0">Recover your password</h4>
                        </CardTitle>
                      </CardHeader>
                      <p className="px-2 auth-title">
                        Please enter your email address and we'll send you
                        instructions on how to reset your password.
                      </p>
                      <CardBody className="pt-1 pb-0">
                        <Form>
                          <FormGroup className="form-label-group">
                            <Input type="text" placeholder="Email" required value={this.state.email}
                                   onChange={(event) => this.changeEmail(event.target.value)}/>
                            <Label>Email</Label>
                          </FormGroup>
                          <div className="float-md-left d-block mb-1">
                            <Button.Ripple
                              color="primary"
                              outline
                              className="px-75 btn-block"
                              onClick={() => history.push("/login")}
                            >
                              Back to Login
                            </Button.Ripple>
                          </div>
                          <div className="float-md-right d-block mb-1">
                            <Button.Ripple
                              color="primary"
                              type="submit"
                              className="px-75 btn-block"
                              onClick={event => {
                                this.forgotPasswordSubmit(event);
                              }}
                            >
                              Recover Password
                            </Button.Ripple>
                          </div>
                        </Form>
                      </CardBody>
                    </Card>
                    : null
                }

              </Col>
            </Row>
          </Card>
          <ToastContainer/>
        </Col>
      </Row>
    )
  }
}

export default ForgotPassword
