import React from "react"
import {Link} from "react-router-dom"
import {CardBody, FormGroup, Form, Input, Button, Label, FormFeedback} from "reactstrap"
import Checkbox from "../../../../components/@vuexy/checkbox/CheckboxesVuexy"
import {Mail, Lock, Check} from "react-feather"
import {loginWithJWT} from "../../../../redux/actions/auth/loginActions"
import {connect} from "react-redux"
import {history} from "../../../../history"
import {toast} from "react-toastify"
import SweetAlert from 'react-bootstrap-sweetalert';
import {bindActionCreators} from "redux"
import AuthService from '../../../../services/auth.service';
import UserService from '../../../../services/user.service';
import {store} from '../../../../redux/storeConfig/store'
import {setUserProfile} from '../../../../redux/actions/user/userActions'

class LoginJWT extends React.Component {
  state = {
    email: "",
    password: "",
    remember: false,
    device_name: 'browser',
    code: '',
    codeInputAlert: false,
    errors: {}
  };

  constructor(props) {
    super(props);
    this.responseStatuses = {
      mismatch: "Mismatch the code",
      codeSent: "Verification code sent to your email"
    }
  }

  handleLogin = async (event) => {
    event && event.preventDefault();
    this.login();
  };

  login = async (triggeredByVerification = false) => {
    let isSuccess = false;
    try {
      await this.getToken(triggeredByVerification);
      const userProfile = await this.getProfile();
      this.props.loginWithJWT(userProfile);
      store.dispatch(setUserProfile(userProfile));
      isSuccess = true;
    } catch (exception) {
      isSuccess = false;
    }

    if (isSuccess) {
      history.push("/")
    }

    return isSuccess;
  };

  getToken = async (triggeredByVerification = false) => {

    try {
      const response = await AuthService.login(this.state);
      if (response.data) {
        const responseData = response.data;
        AuthService.setToken(responseData.data.token);
      }
    } catch (error) {
      if ('response' in error) {

        if (triggeredByVerification) {
          toast.error(error.response.data.error.message)
          throw new Error();
        }

        if (error.response.data.error.message === this.responseStatuses.mismatch) {
          this.login();
          this.codeInputAlert(false);
        } else if (error.response.data.error.message === this.responseStatuses.codeSent) {
          this.codeInputAlert(true);
          toast.warn(error.response.data.error.message)
        } else {
          toast.error(error.response.data.error.message)
        }


        this.setState({...this.state, errors: {...error.errors}, code: ''})
        throw new Error();
      }
    }
  };

  getProfile = async () => {
    try {
      const response = await UserService.getProfile();
      return response.data.data;
    } catch (exception) {
      throw new Error();
    }
  };

  confirmCode = async (value) => {
    this.setState((state, props) => ({code: value}), () => {
      this.codeInputAlert(false);
      this.login(true);
    });
  }

  codeInputAlert = (value) => {
    this.setState({'codeInputAlert': value})
  };

  render() {

    return (
      <React.Fragment>
        <CardBody className="pt-1">
          <Form action="/" onSubmit={this.handleLogin}>
            <FormGroup className="form-label-group position-relative has-icon-left">
              <Input
                type="email"
                placeholder="Email"
                value={this.state.email}
                onChange={event => this.setState({email: event.target.value})}
                required
                {...{invalid: 'email' in this.state.errors}}
              />
              <div className="form-control-position">
                <Mail size={15}/>
              </div>
              <Label>Email</Label>
              <FormFeedback>Oh noes! that name is already taken</FormFeedback>
            </FormGroup>
            <FormGroup className="form-label-group position-relative has-icon-left">
              <Input
                type="password"
                placeholder="Password"
                value={this.state.password}
                onChange={e => this.setState({password: e.target.value})}
                required
              />
              <div className="form-control-position">
                <Lock size={15}/>
              </div>
              <Label>Password</Label>
            </FormGroup>
            <FormGroup className="d-flex justify-content-between align-items-center">
              <Checkbox
                color="primary"
                icon={<Check className="vx-icon" size={16}/>}
                label="Remember me"
                defaultChecked={false}
                onChange={this.handleRemember}
              />
              <div className="float-right">
                <Link to="/forgot-password">Forgot Password?</Link>
              </div>
            </FormGroup>
            <div className="d-flex justify-content-end">
              <Button.Ripple color="primary" type="submit">
                Login
              </Button.Ripple>
            </div>
          </Form>
        </CardBody>
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
      </React.Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {}
};

const mapActionsToProps = dispatch => {
  return {
    loginWithJWT: bindActionCreators(loginWithJWT, dispatch),
  }
};


export default connect(mapStateToProps, mapActionsToProps)(LoginJWT)
