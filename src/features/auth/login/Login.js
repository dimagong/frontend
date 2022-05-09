import React, { useState } from "react";
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
import { Mail, Lock, Check } from "react-feather";
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { useMutation, useQueryClient } from 'react-query'

import TermsAndConditions from "assets/ValidPath-privacy-policy.pdf";

import appSlice from "app/slices/appSlice";
import instance from "../../../api";
import {loginPath} from "../../../constants/auth";
import authService from "../../../services/auth";

const { loginRequest } = appSlice.actions;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [isSecretCodeRequested, setIsSecretCodeRequested] = useState(false);
  const [secretCode, setSecretCode] = useState("");

  const queryClient = useQueryClient();

  const login = useMutation('login', (loginData) => {
    return instance({
      url: loginPath,
      method: "POST",
      data: loginData,
    });
  }, {
    onSuccess: response => {
      if (response.data.data.needs_2fa) {
        queryClient.setQueryData("tmp_token", response.data.data.tmp_token);
        setIsSecretCodeRequested(true);
      } else {
        authService.setToken(response.data.data.token);
        dispatch(loginRequest())
      }
    }
  });

  const loginWithSecretCode = useMutation('loginWithSecretCode', (loginData) => {
    return instance({
      url: "/api/login-two-factor",
      method: "POST",
      data: loginData,
    });
  }, {
    onSuccess: response => {
      authService.setToken(response.data.data.token);
      dispatch(loginRequest())
    }
  });


  const handleLogin = (e) => {
    e.preventDefault();
    // dispatch(loginRequest({ email, password, device_name: "browser", code: "" }));
    login.mutate({ email, password, device_name: "browser", code: "", remember_me: false })
  };

  const handleSecretCodeSend = (e) => {
    e.preventDefault();
    loginWithSecretCode.mutate({tmp_token: queryClient.getQueryData("tmp_token"), device_name: "browser", remember_me: false, code: secretCode});

  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleSecretCode = (e) => {
    setSecretCode(e.target.value);
  };

  return (
    <Row className="login">
      <Col sm="8" xl="7" lg="10" md="8" className="login-col">
        <Card className="login-card">
          <Row className="m-0">
            <Col lg="6" className="d-lg-block d-none text-center align-self-center px-1 py-0">
              <img src={loginImg} alt="loginImg" />
            </Col>
            <Col lg="6" md="12" className="p-0">
              <Card className="rounded-0 mb-0 px-2 login-tabs-container">
                <CardHeader className="pb-1">
                  <CardTitle>
                    <h4 className="mb-0">Welcome to ValidPath Portal</h4>
                  </CardTitle>
                </CardHeader>
                <p className="px-2 auth-title">Please login to proceed.</p>
                <CardBody className="pt-1">
                  <Form onSubmit={isSecretCodeRequested ? handleSecretCodeSend : handleLogin}>
                    {isSecretCodeRequested ? (
                      <FormGroup className="form-label-group position-relative">
                        <Input
                          type="text"
                          placeholder="Enter secret code"
                          value={secretCode}
                          onChange={handleSecretCode}
                          required
                        />
                        <Label>Enter Secret Code</Label>
                      </FormGroup>
                    ) : (
                      <>
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
                          <FormFeedback>Oh noes! that name is already taken</FormFeedback>
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
                      </>
                    )}
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
                        <a href={TermsAndConditions} target="_blank" rel="noopener noreferrer">
                          Privacy & Terms
                        </a>
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
