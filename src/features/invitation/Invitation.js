import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Card, CardHeader, CardTitle, Row, Col } from "reactstrap";

import appSlice from "app/slices/appSlice";

import { useRouter } from "hooks/useRouter";
import { useInvitationAcceptMutation } from "api/Auth/authQuery";

import InvitationForm from "./InvitationForm";

const { getInvitationRequest } = appSlice.actions;

const Invitation = () => {
  const dispatch = useDispatch();

  const { query } = useRouter();
  const { invitationId } = query;

  const invitationAcceptMutation = useInvitationAcceptMutation();

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
                <InvitationForm onInvitationAccept={acceptInvitation} />
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default Invitation;
