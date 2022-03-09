import _ from "lodash/fp";
import React, { useState, useEffect } from "react";
import {
  FormGroup,
  Row,
  Col,
  Input,
  Form,
  Button,
  Label,
  FormFeedback,
  CardTitle,
  CardHeader,
  CardBody,
  Card,
} from "reactstrap";

import { X, Check } from "react-feather";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { selectError } from "app/selectors";

import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";

import { useFormField, useFormGroup, Validators } from "hooks/use-form";

import UserInvitationsCreate from "../userInvitations/UserInvitationsCreate";

import UserAccessManager from "./components/UserAccessManager";
import { useUserAccessManager } from "./components/UserAccessManager/useUserAccessManager";

const { updateUserRequest } = appSlice.actions;

const UserProfileEdit = ({ manager, onEditClose }) => {
  const dispatch = useDispatch();
  const errors = useSelector(selectError) || {};
  const [managerState, setManagerState] = useState(manager);

  // User Bdm
  const [{ data: bdms, error }, { syncBdmUsers }] = useUserAccessManager(manager.id);
  const [bdmsField, setBdmsField] = useFormField([], [Validators.identicalArrayBy([], "id")]);
  const formGroup = useFormGroup({ bdms: bdmsField });

  const onSubmit = (e) => {
    e.preventDefault();
    const bdmUsersIds = formGroup.values.bdms.map(_.get("id"));

    dispatch(updateUserRequest(managerState));
    syncBdmUsers({ userId: manager.id, bdmUsersIds }).subscribe();
  };

  const handleCardClose = () => {
    onEditClose();
  };

  const handleFieldChange = (fieldName, fieldValue) => {
    setManagerState({
      ...managerState,
      [fieldName]: fieldValue,
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => setBdmsField(bdms ? bdms.active : []), [bdms]);

  useEffect(() => {
    setManagerState(manager);
  }, [manager]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-weight-bold">User Edit</CardTitle>
        <div>
          <X
            size={15}
            className="cursor-pointer mr-1"
            onClick={() => {
              handleCardClose();
            }}
          />
        </div>
      </CardHeader>
      <CardBody>
        <Form className="user-create" onSubmit={onSubmit}>
          <Row>
            <Col lg={{ size: 4, order: 1 }} xs={{ size: 6, order: 2 }}>
              <FormGroup>
                <Label for="nameVertical">First Name</Label>
                <Input
                  type="text"
                  name="name"
                  id="nameVertical"
                  placeholder="First Name"
                  value={managerState.first_name}
                  onChange={(event) => handleFieldChange("first_name", event.target.value)}
                  {...{ invalid: errors["first_name"] }}
                />
                <FormFeedback>{errors["first_name"] ? errors["first_name"] : ""}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="EmailVertical">Email</Label>
                <Input
                  type="email"
                  name="Email"
                  id="EmailVertical"
                  placeholder="Email"
                  value={managerState.email}
                  onChange={(event) => handleFieldChange("email", event.target.value)}
                  {...{ invalid: errors["email"] }}
                />
                <FormFeedback>{errors["email"] ? errors["email"] : ""}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Checkbox
                  color="primary"
                  icon={<Check className="vx-icon" size={16} />}
                  label="Show intro page"
                  checked={+managerState.notify === 1}
                  onClick={() => handleFieldChange("notify", Number(!managerState.notify))}
                />
              </FormGroup>
            </Col>
            <Col lg={{ size: 4, order: 2 }} xs={{ size: 6, order: 2 }}>
              <FormGroup>
                <Label for="lastNameVertical">Last Name</Label>
                <Input
                  type="text"
                  name="last_name"
                  id="lastNameVertical"
                  placeholder="Last Name"
                  value={managerState.last_name}
                  onChange={(event) => handleFieldChange("last_name", event.target.value)}
                  {...{ invalid: errors["last_name"] }}
                />
                <FormFeedback>{errors["last_name"] ? errors["last_name"] : ""}</FormFeedback>
              </FormGroup>
              <FormGroup>
                <Label for="mobileVertical">Number</Label>
                <Input
                  type="text"
                  name="number"
                  id="mobileVertical"
                  placeholder="Mobile"
                  value={managerState.number}
                  onChange={(event) => handleFieldChange("number", event.target.value)}
                  {...{ invalid: errors["number"] }}
                />
                <FormFeedback>{errors["number"] ? errors["number"] : ""}</FormFeedback>
              </FormGroup>
            </Col>
            <Col lg={{ size: 4, order: 3 }} xs={{ size: 12, order: 1 }}>
              <UserAccessManager
                active={bdmsField.value}
                potential={bdms?.potential}
                error={error}
                errors={bdmsField.errors}
                onChange={setBdmsField}
              />
            </Col>
          </Row>

          <Row>
            <Col sm="6">
              <p style={{ marginBottom: 5 }}>Portal access:</p>
              {manager.invited && !manager.invited.revoked_at ? (
                <UserInvitationsCreate
                  user={manager}
                  send={false}
                  resend={true}
                  trash={true}
                  invitationText="Resend invitation"
                />
              ) : manager.invited && !manager.invited.accepted_at ? (
                <UserInvitationsCreate
                  user={manager}
                  send={false}
                  resend={true}
                  trash={true}
                  invitationText="Resend invitation"
                />
              ) : manager?.permissions?.ability !== "lead" &&
                manager?.permissions?.ability !== "suspect" &&
                manager?.permissions?.ability !== "archived" &&
                manager.groups.length ? (
                <UserInvitationsCreate send={true} resend={false} trash={false} user={manager} />
              ) : (
                <p className="m-0" style={{ paddingLeft: "0.2rem" }}>
                  User cannot be invited
                </p>
              )}
            </Col>
            <Col className="d-flex justify-content-end align-items-end" sm="6">
              <Button.Ripple className="m-0" color="primary" type="submit">
                Save
              </Button.Ripple>
            </Col>
          </Row>
        </Form>
      </CardBody>
    </Card>
  );
};

export default UserProfileEdit;
