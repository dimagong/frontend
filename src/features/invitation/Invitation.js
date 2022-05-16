import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, Row, Col } from "reactstrap";
import { selectError, selectInvitation } from "app/selectors";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "hooks/useRouter";
import { useInvitationAcceptQuery, useLoginQuery } from "api/Auth/authQuery";
import SecretCode from "../auth/SecretCode";
import InvitationForm from "./InvitationForm";
import appSlice from "app/slices/appSlice";
import authService from "../../services/auth";

const { getInvitationRequest, loginRequest } = appSlice.actions;

const Invitation = () => {
  const errors = useSelector(selectError) || {};
  const invitation = useSelector(selectInvitation);
  const [isSecretCodeRequested, setIsSecretCodeRequested] = useState(false);
  const dispatch = useDispatch();
  const { query } = useRouter();
  const { invitationId } = query;

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

  const invitationAcceptMutation = useInvitationAcceptQuery({
    onSuccess: (_, payload) => {
      login.mutate({
        password: payload.password,
        remember_me: false,
        device_name: "browser",
        email: invitation.invitedUser.email,
      });
    },
  });

  useEffect(() => {
    dispatch(getInvitationRequest({ invitationId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const acceptInvitation = (formData) => {
    invitationAcceptMutation.mutate({
      invitation_token: invitationId,
      ...formData,
      code: "",
    });
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
                {isSecretCodeRequested ? <SecretCode /> : <InvitationForm onInvitationAccept={acceptInvitation} />}
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default Invitation;
