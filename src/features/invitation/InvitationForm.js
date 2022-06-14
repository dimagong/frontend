import React, { useState } from "react";
import { Button, Card, CardBody, Form, FormFeedback, FormGroup, Input, Label } from "reactstrap";
import AuthButton from "../auth/AuthButton";
import { useSelector } from "react-redux";
import { selectError } from "../../app/selectors";

const invitationFormInitialData = {
  password: "",
  password_confirmation: "",
};

const InvitationForm = ({ onInvitationAccept }) => {
  const [formData, setFormData] = useState(invitationFormInitialData);

  const errors = useSelector(selectError) || {};

  const handleInvitationAccept = (e) => {
    e.preventDefault();

    onInvitationAccept(formData);
  };

  const handleFormDataChange = (key, value) => {
    setFormData({ ...formData, [key]: value });
  };

  return (
    <>
      <p className="px-2 auth-title">Please enter a password</p>
      <CardBody className="pt-1">
        <Form action="/">
          <FormGroup className="form-label-group position-relative">
            <Input
              value={formData.password}
              onChange={(e) => handleFormDataChange("password", e.target.value)}
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
              value={formData.password_confirmation}
              onChange={(e) => handleFormDataChange("password_confirmation", e.target.value)}
              type="password"
              placeholder="Password confirmation"
              required
              {...{ invalid: errors["password_confirmation"] }}
            />

            <Label>Password confirmation</Label>
            <FormFeedback>{errors["password_confirmation"]}</FormFeedback>
          </FormGroup>
          <AuthButton value={"Submit"} onClick={handleInvitationAccept} />
        </Form>
      </CardBody>
    </>
  );
};

export default InvitationForm;
