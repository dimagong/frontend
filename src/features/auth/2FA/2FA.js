import React, { useState } from "react";
import { CardBody, Form, FormGroup, Input, Label } from "reactstrap";

import { use2FALoginMutation } from "api/Auth/authQuery";

import AuthButton from "../AuthButton";
import LoginTemplate from "../LoginTemplate";

const TwoFactorAuthenticator = () => {
  const [secretCode, setSecretCode] = useState("");

  const twoFactorLogin = use2FALoginMutation();

  const handleSecretCodeSend = (e) => {
    e.preventDefault();

    twoFactorLogin.mutate({
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
    <LoginTemplate>
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
          <AuthButton value="Submit" onClick={handleSecretCodeSend} />
        </Form>
      </CardBody>
    </LoginTemplate>
  );
};

export default TwoFactorAuthenticator;
