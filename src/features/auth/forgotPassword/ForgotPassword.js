import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  CardHeader,
  CardTitle,
  CardBody,
  Spinner,
} from "reactstrap";
import fgImg from "assets/img/pages/forgot-password.png";

import ForgotPasswordFactory from "./ForgotPasswordFactory";
import PageTemplate from "templates/pageTemplate";
import {
  STEP_FORGOT,
  STEP_FORGOT_SUCCESS,
  STEP_VERYFI,
  STEP_VERYFI_SUCCESS,
} from "constants/resetPasswordSteps";
import { useSelector } from "react-redux";
import { selectLoading, selectError } from "app/selectors/authSelectors";
import { useRouter } from "hooks/useRouter";
import { useDispatch } from "react-redux";
import {resetPasswordRequest, verifyPasswordRequest} from 'app/slices/appSlice'

const ForgotPassword = () => {
  const {query} = useRouter();
  const isLoading = useSelector(selectLoading);
  const isError = useSelector(selectError);
  const [step, setStep] = useState( query.token? STEP_VERYFI : STEP_FORGOT);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const dispatch = useDispatch();

  const changeEmail = e => setEmail(e.target.value)
  const changePassword = e => setPassword(e.target.value)
  const changePasswordConfirmation = e => setPasswordConfirmation(e.target.value)

  const forgotPasswordSubmit = e => {
    e.preventDefault();
    dispatch(resetPasswordRequest({email}))
    setStep(STEP_FORGOT_SUCCESS)
  }

  const recoveryPasswordSubmit  = e => {
    e.preventDefault();
    dispatch(verifyPasswordRequest({token: query.token, password, password_confirmation, email}))
    // setStep(STEP_VERYFI_SUCCESS)
  }

  useEffect(() => {
    if(query.email){
      setEmail(query.email)
    }
  }, [query])

  useEffect(() => {
    if(isError){
      // setStep(STEP_FORGOT)
    }
  },[isError])

  return (
    <PageTemplate>
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
                className="d-lg-block d-none text-center align-self-center py-1"
              >
                <img src={fgImg} alt="fgImg" />
              </Col>
              <Col lg="6" md="12" className="p-0">
                {isLoading ? (
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
    </PageTemplate>
  );
};

export default ForgotPassword;
