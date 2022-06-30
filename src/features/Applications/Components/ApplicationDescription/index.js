import React from "react";
import { Row, Col } from "reactstrap";

import "./styles.scss";
import Checkbox from "../../../Surveys/Components/SurveyFormComponents/Checkbox";
import TextWidget from "../../../../components/FormCreate/Custom/TextWidget";

const ApplicationDescription = () => {
  return (
    <Row className="application-description">
      <Col md={12}>
        <div className="application-description__organization d-flex justify-content-between">
          <div className="d-flex">
            <div className="font-weight-bold">Organization</div>
            <div className="application-description__organization-name w-100">Test org</div>
          </div>
          <div>
            <Checkbox checked={true} label={"Is private"} onChange={() => {}} name={"is_private"} />
          </div>
        </div>
        <div className={"mb-2"}>
          <TextWidget value={""} label={"Name"} placeholder={"Enter application name"} onChange={() => {}} />
        </div>
        <div>
          <TextWidget
            value={""}
            label={"Description"}
            placeholder={"Enter application description"}
            onChange={() => {}}
          />
        </div>
      </Col>
    </Row>
  );
};

export default ApplicationDescription;
