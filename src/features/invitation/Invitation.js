import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Row,
  Col,
  Input,
  Form,
  Button,
  Label,
  FormFeedback,
} from "reactstrap";
import {selectError, selectInvitation} from "app/selectors";
import { useQueryClient } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "hooks/useRouter";
import TermsAndConditions from "assets/ValidPath-privacy-policy.pdf";
import {useInvitationAcceptQuery, useLoginQuery, useLoginWithSecretCode} from "api/Auth/authQuery";

import appSlice from "app/slices/appSlice";
import authService from "../../services/auth";

const { getInvitationRequest, sendInvitationAcceptRequest, loginRequest } = appSlice.actions;

const Invitation = () => {
  const errors = useSelector(selectError) || {};
  const invitation = useSelector(selectInvitation);
  const [invitationAccept, setInvitationAccept] = useState({});
  const [isSecretCodeRequested, setIsSecretCodeRequested] = useState(false);
  const [secretCode, setSecretCode] = useState("");
  const dispatch = useDispatch();
  const { query } = useRouter();
  const { invitationId } = query;

  const queryClient = useQueryClient();

  const login = useLoginQuery({
    onSuccess: response => {
      if (response.needs_2fa) {
        queryClient.setQueryData("tmp_token", response.tmp_token);
        setIsSecretCodeRequested(true);
      } else {
        authService.setToken(response.token);
        // login request needed because we have profile fetch in redux-saga that currently not refactored to react-query
        dispatch(loginRequest())
      }
    }
  });

  const loginWithSecretCode = useLoginWithSecretCode({
    onSuccess: response => {
      authService.setToken(response.token);
      // login request needed because we have profile fetch in redux-saga that currently not refactored to react-query
      dispatch(loginRequest())
    }
  });
  const invitationAcceptMutation = useInvitationAcceptQuery({
    onSuccess: () => {
      login.mutate({
        password: invitationAccept.password,
        remember_me: false,
        device_name: "browser",
        email: invitation.invitedUser.email,
      })
    }
  });

  useEffect(() => {
    dispatch(getInvitationRequest({ invitationId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendSecretCode = () => {
    loginWithSecretCode.mutate({
      tmp_token: queryClient.getQueryData("tmp_token"),
      device_name: "browser",
      remember_me: false,
      code: secretCode
    })
  };

  const acceptInvitation = (e) => {
    e.preventDefault();

    invitationAcceptMutation.mutate({
      invitation_token: invitationId,
      ...invitationAccept,
      code: "",
    });

    // dispatch(sendInvitationAcceptRequest({ data: { invitation_token: invitationId, ...invitationAccept, code: "" } }));
  };

  const onPasswordChange = (event) => {
    setInvitationAccept({
      ...invitationAccept,
      password: event.target.value,
    });
  };

  const onPasswordConfirmationChange = (event) => {
    setInvitationAccept({
      ...invitationAccept,
      password_confirmation: event.target.value,
    });
  };

  const handleSecretCode = (e) => {
    setSecretCode(e.target.value);
  };

  return (
    <Row className="m-0 justify-content-center">
      <Col sm="12" xl="5" lg="6" md="6" className="d-flex justify-content-center">
        <Card className="bg-authentication login-card rounded-0 mb-0 w-100">
          <Row className="m-0">
            <Col lg="12" md="12" className="p-0">
              <Card className="rounded-0 mb-0 px-2">
                <CardHeader className="pb-1">
                  <CardTitle>
                    <h4 className="mb-0">Welcome to ValidPath Portal</h4>
                  </CardTitle>
                </CardHeader>
                <p className="px-2 auth-title">Please enter a password</p>
                <CardBody className="pt-1">
                  <Form action="/">
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
                        <FormGroup className="form-label-group position-relative">
                          <Input
                            value={invitationAccept.password}
                            onChange={onPasswordChange}
                            type="password"
                            placeholder="Password"
                            required
                            {...{ invalid: errors["password"] }}
                          />
                          <Label>Password</Label>
                          <FormFeedback>{errors["password"]}</FormFeedback>
                        </FormGroup>
                        <FormGroup className="form-label-group position-relative">
                          <Input
                            value={invitationAccept.password_confirmation}
                            onChange={onPasswordConfirmationChange}
                            type="password"
                            placeholder="Password confirmation"
                            required
                            {...{ invalid: errors["password_confirmation"] }}
                          />

                          <Label>Password confirmation</Label>
                          <FormFeedback>{errors["password_confirmation"]}</FormFeedback>
                        </FormGroup>
                      </>
                    )}
                    <div className="d-flex justify-content-between">
                      <p style={{ margin: "auto 0" }}>
                        By clicking Submit, you agree to our{" "}
                        <a href={TermsAndConditions} target="_blank" rel="noopener noreferrer">
                          Privacy and Terms
                        </a>
                      </p>
                      <Button color="primary" type="submit" onClick={isSecretCodeRequested ? sendSecretCode : acceptInvitation}>
                        Submit
                      </Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default Invitation;
