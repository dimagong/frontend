import React, { useEffect, useState } from "react";
import loginImg from "assets/img/pages/login.png";
import {
  Card,
  CardHeader,
  CardTitle,
  Row,
  Col,
  CardBody,
  FormGroup,
  Form,
  Input,
  Button,
  Label,
  FormFeedback,
} from "reactstrap";
// import SweetAlert from "react-bootstrap-sweetalert";
import { Mail, Lock, Check } from "react-feather";
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";
import { Link } from "react-router-dom";
import PageTemplate from "templates/pageTemplate";
import { useDispatch } from "react-redux";
import {loginRequest} from "app/slices/appSlice"
import { push } from "connected-react-router"

import TermsAndConditions from 'assets/ValidPath-privacy-policy.pdf'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = (e) =>{
    e.preventDefault();
    dispatch(loginRequest({email, password, device_name: "browser", code: ""}))};

  const handlePassword = (e) => {
    setPassword(e.target.value);
  }

  const handleEmail = (e) => {
    setEmail(e.target.value);
  }

  return (
      <Row className="login">
        <Col sm="8" xl="7" lg="10" md="8" className="login-col">
          <Card className="login-card">
            <Row className="m-0">
              <Col
                lg="6"
                className="d-lg-block d-none text-center align-self-center px-1 py-0"
              >
                <img src={loginImg} alt="loginImg" />
              </Col>
              <Col lg="6" md="12" className="p-0">
                <Card className="rounded-0 mb-0 px-2 login-tabs-container">
                  <CardHeader className="pb-1">
                    <CardTitle>
                      <h4 className="mb-0">Welcome to ValidPath Portal</h4>
                    </CardTitle>
                  </CardHeader>
                  <p className="px-2 auth-title">
                    Please login to proceed.
                  </p>
                  <CardBody className="pt-1">
                    <Form
                      onSubmit={handleLogin}
                    >
                      <FormGroup className="form-label-group position-relative has-icon-left">
                        <Input
                          type="email"
                          placeholder="Email"
                          value={email}
                          onChange={handleEmail}
                          required
                          // {...{invalid: 'email' in this.state.errors}}
                        />
                        <div className="form-control-position">
                          <Mail size={15} />
                        </div>
                        <Label>Email</Label>
                        <FormFeedback>
                          Oh noes! that name is already taken
                        </FormFeedback>
                      </FormGroup>
                      <FormGroup className="form-label-group position-relative has-icon-left">
                        <Input
                          type="password"
                          placeholder="Password"
                          value={password}
                          onChange={handlePassword}
                          required
                        />
                        <div className="form-control-position">
                          <Lock size={15} />
                        </div>
                        <Label>Password</Label>
                      </FormGroup>
                      <FormGroup className="d-flex justify-content-between align-items-center">
                        <Checkbox
                          color="primary"
                          icon={<Check className="vx-icon" size={16} />}
                          label="Remember me"
                          defaultChecked={false}
                          // onChange={handleRemember}
                        />
                        <div className="float-right">
                          <Link to="/forgot-password">Forgot Password?</Link>
                        </div>
                      </FormGroup>
                      <div className="d-flex justify-content-between align-items-end">
                        <div>
                          <a href={TermsAndConditions} target="_blank" rel='noopener noreferrer'>Privacy & Terms</a>
                        </div>
                        <Button color="primary" type="submit">
                          Login
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                  {/* <SweetAlert
                    title="Code Verification"
                    input
                    show={true}
                    placeHolder="Your code"
                    onConfirm={(response) => confirmCode(response)}
                  >
                    <p className="sweet-alert-text">
                      Please check your email address and enter the code
                    </p>
                  </SweetAlert> */}
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
  );
};

export default Login;
