import "./styles.scss";

import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Lock, Mail } from "react-feather";
import { CardBody, Form, FormFeedback, FormGroup, Input, Label } from "reactstrap";

import { NmpCheckbox } from "features/nmp-ui";

import AuthButton from "../AuthButton";

const loginFormInitialData = {
  email: "",
  password: "",
  isRememberMe: false,
};

const LoginForm = ({ onLogin }) => {
  const [formData, setFormData] = useState(loginFormInitialData);

  const handleLogin = () => {
    onLogin(formData);
  };

  const handleFormDataChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <>
      <p className="px-2 login__title">Please login to proceed.</p>

      <CardBody className="pt-1">
        <Form>
          <FormGroup className="form-label-group position-relative has-icon-left">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleFormDataChange("email", e.target.value)}
              required
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
              value={formData.password}
              onChange={(e) => handleFormDataChange("password", e.target.value)}
              required
            />
            <div className="form-control-position">
              <Lock size={15} />
            </div>
            <Label>Password</Label>
          </FormGroup>
          <FormGroup className="d-flex justify-content-between align-items-center">
            <NmpCheckbox
              checked={formData.isRememberMe}
              onChange={(e) => handleFormDataChange("isRememberMe", e.target.checked)}
            >
              Remember me
            </NmpCheckbox>

            <div className="float-right">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>
          </FormGroup>
          <AuthButton value="Login" onClick={handleLogin} />
        </Form>
      </CardBody>
    </>
  );
};

export default LoginForm;
