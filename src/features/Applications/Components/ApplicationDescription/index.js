import React from "react";
import { Row, Col } from "reactstrap";

import "./styles.scss";
import Checkbox from "../../../Surveys/Components/SurveyFormComponents/Checkbox";
import TextWidget from "../../../../components/FormCreate/Custom/TextWidget";

const ApplicationDescription = ({ onChange, name, description, isPrivate, organization = {} }) => {
  const handlePrivateFlagChange = () => {
    onChange("isPrivate", !isPrivate);
  };

  const handleNameChange = (value) => {
    onChange("name", value.trim());
  };

  const handleDescriptionChange = (value) => {
    onChange("description", value.trim());
  };

  return (
    <Row className="application-description">
      <Col md={12}>
        <div className="application-description__organization d-flex justify-content-between">
          <div className="d-flex">
            <div className="font-weight-bold">Organization</div>
            <div className="application-description__organization-name w-100">{organization.name}</div>
          </div>
          <div>
            <Checkbox checked={isPrivate} label={"Is private"} onChange={handlePrivateFlagChange} name={"is_private"} />
          </div>
        </div>
        <div className={"mb-2"}>
          <TextWidget value={name} label={"Name"} placeholder={"Enter application name"} onChange={handleNameChange} />
        </div>
        <div>
          <TextWidget
            value={description}
            label={"Description"}
            placeholder={"Enter application description"}
            onChange={handleDescriptionChange}
          />
        </div>
      </Col>
    </Row>
  );
};

export default ApplicationDescription;
