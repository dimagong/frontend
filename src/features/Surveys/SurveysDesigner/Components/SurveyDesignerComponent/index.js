import React, {useState} from 'react';

import {
  Col,
  Button,
  Spinner,
} from 'reactstrap';

import { Edit } from 'react-feather'

import SurveysDesignerQuestionsList from "./Components/SurveysDesignerQuestionsList";

import "./styles.scss";

const SurveysDesignerComponent = ({ survey, isSurveyLoading }) => {

  const {latest_version} = survey || {};

  return (
    <Col className={"survey-designer"} xs={6} >
      <div className={"survey-designer_header"}>
        <div className={"d-flex"}>
          <div className={"survey-designer_header_title"}>
            Survey Designer
          </div>
          <div className={"survey-designer_header_survey-name"}>
            {!isSurveyLoading && latest_version.title}
          </div>
        </div>
        <div className={"survey-designer_header_edit-icon"}>
          <Edit size={22} />
        </div>
      </div>

      {!isSurveyLoading ? (
        <>
          <SurveysDesignerQuestionsList questions={latest_version.questions} />
          <Button
            className={"survey-designer_save-button"}
            color="primary"
            onClick={() => {}}
          >
            Save survey
          </Button>
        </>
      ) : (
        <div className="survey-designer_loading">
          <Spinner color="primary" size={40} />
        </div>
      )}
    </Col>
  )
};

export default SurveysDesignerComponent;
