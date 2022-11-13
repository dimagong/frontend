import "./styles.scss";

import React from "react";
import { Card, CardHeader, CardTitle, Col, Row } from "reactstrap";

import loginImg from "assets/img/pages/login.png";

const LoginTemplate = ({ children }) => {
  return (
    <Row className="login-template">
      <Col sm="8" xl="7" lg="10" md="8" className="login-template__col">
        <Card className="login-template__card">
          <Row className="m-0">
            <Col lg="6" className="d-lg-block d-none text-center align-self-center px-1 py-0">
              <img src={loginImg} alt="loginImg" />
            </Col>
            <Col lg="6" md="12" className="p-0">
              <Card className="rounded-0 mb-0 px-2 login-template__tabs-container">
                <CardHeader className="pb-1">
                  <CardTitle>
                    <h4 className="mb-0">Welcome to ValidPath Portal</h4>
                  </CardTitle>
                </CardHeader>
                {children}
              </Card>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default LoginTemplate;
