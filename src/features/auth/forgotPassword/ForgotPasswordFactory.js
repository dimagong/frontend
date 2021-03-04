import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Form,
  Input,
  Button,
  Label,
} from "reactstrap";
import { useRouter } from "hooks/useRouter";
import { loginPath } from "constants/paths";
import {
  STEP_FORGOT,
  STEP_FORGOT_SUCCESS,
  STEP_VERYFI,
  STEP_VERYFI_SUCCESS,
} from "constants/resetPasswordSteps";

const ForgotPasswordFactory = ({
  step,
  email,
  passwordConfirmation,
  password,
  changeEmail,
  changePassword,
  changePasswordConfirmation,
  recoveryPasswordSubmit,
  forgotPasswordSubmit,
}) => {
  const { push } = useRouter();

  const goToLogin = () => push(loginPath);
  switch (step) {
    case STEP_FORGOT_SUCCESS:
      return (
        <Card className="rounded-0 mb-0 px-2 py-1 h-100">
          <CardBody className="pt-1 pb-0 recover-link-send">
            <h4 className="mb-0">
              Password recovery link was successfully sent to your email
              address
            </h4>
            <div className="float-md-left d-block mb-1">
              <Button
                color="primary"
                outline
                className="px-75 btn-block"
                onClick={goToLogin}
              >
                Back to Login
              </Button>
            </div>
          </CardBody>
        </Card>
      );
    case STEP_VERYFI_SUCCESS:
      return (
        <Card className="rounded-0 mb-0 px-2 py-1 h-100">
          <CardHeader className="pb-1">
            <CardTitle>
              <h4 className="mb-0">Password changed successfully</h4>
            </CardTitle>
          </CardHeader>
          <CardBody className="pt-1 pb-0 password-changed">
            <div className="float-md-left d-block mb-1">
              <Button
                color="primary"
                outline
                className="px-75 btn-block"
                onClick={goToLogin}
              >
                Back to Login
              </Button>
            </div>
          </CardBody>
        </Card>
      );
    case STEP_VERYFI:
      return (
        <Card className="rounded-0 mb-0 px-2 py-1 h-100">
          <CardHeader className="pb-1">
            <CardTitle>
              <h4 className="mb-0">Recover your password</h4>
            </CardTitle>
          </CardHeader>
          <p className="px-2 auth-title">Please enter your new password</p>
          <CardBody className="pt-1 pb-0">
            <Form>
              <FormGroup className="form-label-group">
                <Input
                  type="text"
                  placeholder="Email"
                  required
                  value={email}
                  disabled
                  onChange={changeEmail}
                />
                <Label>Email</Label>
              </FormGroup>
              <FormGroup className="form-label-group">
                <Input
                  type="password"
                  placeholder="Password"
                  required
                  value={password}
                  onChange={changePassword}
                />
                <Label>Password</Label>
              </FormGroup>
              <FormGroup className="form-label-group">
                <Input
                  type="password"
                  placeholder="Password confirmation"
                  required
                  value={passwordConfirmation}
                  onChange={changePasswordConfirmation}
                />
                <Label>Password confirmation</Label>
              </FormGroup>
              <div className="float-md-left d-block mb-1">
                <Button
                  color="primary"
                  outline
                  className="px-75 btn-block"
                  onClick={goToLogin}
                >
                  Back to Login
                </Button>
              </div>
              <div className="float-md-right d-block mb-1">
                <Button
                  color="primary"
                  type="submit"
                  className="px-75 btn-block"
                  onClick={recoveryPasswordSubmit}
                >
                  Change password
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      );
    case STEP_FORGOT:
      return (
        <Card className="rounded-0 mb-0 px-2 py-1 h-100">
          <CardHeader className="pb-1">
            <CardTitle>
              <h4 className="mb-0">Recover your password</h4>
            </CardTitle>
          </CardHeader>
          <p className="px-2 auth-title">
            Please enter your email address and we'll send you instructions on
            how to reset your password.
          </p>
          <CardBody className="pt-1 pb-0">
            <Form>
              <FormGroup className="form-label-group">
                <Input
                  type="text"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={changeEmail}
                />
                <Label>Email</Label>
              </FormGroup>
              <div className="float-md-left d-block mb-1">
                <Button
                  color="primary"
                  outline
                  className="px-75 btn-block"
                  onClick={goToLogin}
                >
                  Back to Login
                </Button>
              </div>
              <div className="float-md-right d-block mb-1">
                <Button
                  color="primary"
                  type="submit"
                  className="px-75 btn-block"
                  onClick={forgotPasswordSubmit}
                >
                  Recover Password
                </Button>
              </div>
            </Form>
          </CardBody>
        </Card>
      );

    default:
      return <></>;
  }
};

export default ForgotPasswordFactory;
