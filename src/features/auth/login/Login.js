import React, { useState } from "react";
import loginImg from "assets/img/pages/login.png";
import { Card, Row, Col, CardHeader, CardTitle } from "reactstrap";
import SecretCode from "../SecretCode";
import LoginForm from "./LoginForm";

import { useDispatch } from "react-redux";

import appSlice from "app/slices/appSlice";
import authService from "services/auth";
import { useLoginQuery } from "api/Auth/authQuery";

const { loginRequest } = appSlice.actions;

const Login = () => {
  const dispatch = useDispatch();

  const [isSecretCodeRequested, setIsSecretCodeRequested] = useState(false);

  const login = useLoginQuery({
    onSuccess: (response) => {
      if (response.needs_2fa) {
        localStorage.setItem("tmp_token", response.tmp_token);
        setIsSecretCodeRequested(true);
      } else {
        authService.setToken(response.token);
        // login request needed because we have profile fetch in redux-saga that currently not refactored to react-query
        dispatch(loginRequest());
      }
    },
  });

  const handleLogin = (formData) => {
    login.mutate({
      email: formData.email,
      password: formData.password,
      device_name: "browser",
      remember_me: formData.isRememberMe,
    });
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
                {isSecretCodeRequested ? <SecretCode /> : <LoginForm onLogin={handleLogin} />}
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
