import React from "react";
import loginImg from "assets/img/pages/login.png";
import {
  Card,
  CardHeader,
  CardTitle,
  Row,
  Col,
  CardBody,
  FormGroup,
  Form,
  Input,
  Button,
  Label,
  FormFeedback,
} from "reactstrap";
import { ToastContainer } from "react-toastify";
import SweetAlert from "react-bootstrap-sweetalert";
import { Mail, Lock, Check } from "react-feather";
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";
import { Link } from "react-router-dom";
import PageTemplate from "templates/pageTemplate";

const Login = () => {
  return (
    <PageTemplate>
      <Row className="login">
        <Col sm="8" xl="7" lg="10" md="8" className="login-col">
          <Card className="login-card">
            <Row className="m-0">
              <Col
                lg="6"
                className="d-lg-block d-none text-center align-self-center px-1 py-0"
              >
                <img src={loginImg} alt="loginImg" />
              </Col>
              <Col lg="6" md="12" className="p-0">
                <Card className="rounded-0 mb-0 px-2 login-tabs-container">
                  <CardHeader className="pb-1">
                    <CardTitle>
                      <h4 className="mb-0">Login</h4>
                    </CardTitle>
                  </CardHeader>
                  <p className="px-2 auth-title">
                    Welcome back, please login to your account.
                  </p>
                  <CardBody className="pt-1">
                    <Form
                    //   action="/"
                    //   onSubmit={this.handleLogin}
                    >
                      <FormGroup className="form-label-group position-relative has-icon-left">
                        <Input
                          type="email"
                          placeholder="Email"
                          // value={this.state.email}
                          // onChange={event => this.setState({email: event.target.value})}
                          required
                          // {...{invalid: 'email' in this.state.errors}}
                        />
                        <div className="form-control-position">
                          <Mail size={15} />
                        </div>
                        <Label>Email</Label>
                        <FormFeedback>
                          Oh noes! that name is already taken
                        </FormFeedback>
                      </FormGroup>
                      <FormGroup className="form-label-group position-relative has-icon-left">
                        <Input
                          type="password"
                          placeholder="Password"
                          // value={this.state.password}
                          // onChange={e => this.setState({password: e.target.value})}
                          required
                        />
                        <div className="form-control-position">
                          <Lock size={15} />
                        </div>
                        <Label>Password</Label>
                      </FormGroup>
                      <FormGroup className="d-flex justify-content-between align-items-center">
                        <Checkbox
                          color="primary"
                          icon={<Check className="vx-icon" size={16} />}
                          label="Remember me"
                          defaultChecked={false}
                          // onChange={this.handleRemember}
                        />
                        <div className="float-right">
                          <Link to="/forgot-password">Forgot Password?</Link>
                        </div>
                      </FormGroup>
                      <div className="d-flex justify-content-end">
                        <Button color="primary" type="submit">
                          Login
                        </Button>
                      </div>
                    </Form>
                  </CardBody>
                  <SweetAlert
                    title="Code Verification"
                    input
                    show={false}
                    placeHolder="Your code"
                    // onConfirm={(response) => this.confirmCode(response)}
                  >
                    <p className="sweet-alert-text">
                      Please check your email address and enter the code
                    </p>
                  </SweetAlert>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
        <ToastContainer />
      </Row>
    </PageTemplate>
  );
};

export default Login;
