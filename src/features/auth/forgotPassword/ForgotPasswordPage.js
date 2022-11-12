import "../../../old-styles";
import "./styles.scss";

import React, { useState } from "react";
import { Card, Row, Col, CardHeader, CardTitle, CardBody, Spinner } from "reactstrap";

import { useRouter } from "hooks/useRouter";
import fgImg from "assets/img/pages/forgot-password.png";
import { useForgotPasswordMutation, usePasswordResetMutation } from "api/Auth/authQuery";
import { STEP_FORGOT, STEP_FORGOT_SUCCESS, STEP_VERYFI } from "constants/resetPasswordSteps";

import ForgotPasswordFactory from "./ForgotPasswordFactory";

const ForgotPasswordPage = () => {
  // Common
  const { query } = useRouter();
  // Mutations
  const passwordReset = usePasswordResetMutation();
  const forgotPassword = useForgotPasswordMutation();
  // Form step
  const [step, setStep] = useState(query.token ? STEP_VERYFI : STEP_FORGOT);
  // Fields
  const [email, setEmail] = useState(query.email || "");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  // Fields handlers
  const changeEmail = (e) => setEmail(e.target.value);
  const changePassword = (e) => setPassword(e.target.value);
  const changePasswordConfirmation = (e) => setPasswordConfirmation(e.target.value);

  const forgotPasswordSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword.mutateAsync({ email });
    setStep(STEP_FORGOT_SUCCESS);
  };

  const recoveryPasswordSubmit = (e) => {
    e.preventDefault();
    passwordReset.mutate({ token: query.token, password, password_confirmation, email });
  };

  return (
    <Row className="m-0 justify-content-center">
      <Col sm="8" xl="7" lg="10" md="8" className="d-flex justify-content-center">
        <Card className="bg-authentication rounded-0 mb-0 w-100">
          <Row className="m-0">
            <Col lg="6" className="d-lg-block d-none text-center align-self-center py-1">
              <img src={fgImg} alt="fgImg" />
            </Col>
            <Col lg="6" md="12" className="p-0">
              {forgotPassword.isLoading || passwordReset.isLoading ? (
                <Card className="rounded-0 mb-0 px-2 py-1 h-100">
                  <CardHeader className="pb-1">
                    <CardTitle>
                      <h4 className="mb-0">Sending..</h4>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="pt-1 pb-0">
                    <div className="text-center">
                      <Spinner color="primary" />
                    </div>
                  </CardBody>
                </Card>
              ) : (
                <ForgotPasswordFactory
                  step={step}
                  email={email}
                  passwordConfirmation={password_confirmation}
                  password={password}
                  changeEmail={changeEmail}
                  changePassword={changePassword}
                  changePasswordConfirmation={changePasswordConfirmation}
                  recoveryPasswordSubmit={recoveryPasswordSubmit}
                  forgotPasswordSubmit={forgotPasswordSubmit}
                />
              )}
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default ForgotPasswordPage;
