import "../../../old-styles";

import React from "react";
import { Card, CardBody, Button, Row, Col } from "reactstrap";

import errorImg from "assets/img/pages/404.png";
import { Layout } from "utility/context/Layout";

const Error404 = () => {
  return (
    <Layout type="full">
      <Row className="m-0">
        <Col sm="12">
          <Card className="auth-card bg-transparent shadow-none rounded-0 mb-0 w-100">
            <CardBody className="text-center">
              <img src={errorImg} alt="ErrorImg" className="img-fluid align-self-center" />
              <h1 className="font-large-2 my-1">404 - Page Not Found!</h1>
              <p className="pt-2 mb-0">
                paraphonic unassessable foramination Caulopteris worral Spirophyton encrimson esparcet aggerate
                chondrule restate whistler shallopy
              </p>
              <p className="pb-2">biosystematy area bertram plotting unstarting quarterstaff.</p>
              <Button tag="a" href="/" color="primary" size="lg" className="mt-2">
                Back to Home
              </Button>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Layout>
  );
};

export default Error404;
