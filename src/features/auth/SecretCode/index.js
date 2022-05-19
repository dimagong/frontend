import React, { useState } from "react";
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Form, FormGroup, Input, Label } from "reactstrap";
import AuthButton from "../AuthButton";
import TermsAndConditions from "assets/ValidPath-privacy-policy.pdf";
import { useLoginWithSecretCode } from "api/Auth/authQuery";
import authService from "services/auth";
import { useDispatch } from "react-redux";
import appSlice from "app/slices/appSlice";

const { loginRequest } = appSlice.actions;

const SecretCode = () => {
  const dispatch = useDispatch();

  const [secretCode, setSecretCode] = useState("");

  const loginWithSecretCode = useLoginWithSecretCode({
    onSuccess: (response) => {
      authService.setToken(response.token);
      // login request needed because we have profile fetch in redux-saga that currently not refactored to react-query
      dispatch(loginRequest());
    },
  });

  const handleSecretCodeSend = (e) => {
    e.preventDefault();

    loginWithSecretCode.mutate({
      tmp_token: localStorage.getItem("tmp_token"),
      device_name: "browser",
      remember_me: true,
      code: secretCode,
    });
  };

  const handleSecretCode = (e) => {
    setSecretCode(e.target.value);
  };

  return (
    <>
      <p className="px-2 auth-title">Please enter secret code</p>
      <CardBody className="pt-1">
        <Form>
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
          <AuthButton value={"Submit"} onClick={handleSecretCodeSend} />
        </Form>
      </CardBody>
    </>
  );
};

export default SecretCode;
