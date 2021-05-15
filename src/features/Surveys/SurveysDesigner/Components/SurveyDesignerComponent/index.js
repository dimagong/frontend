import React, {useState} from 'react';

import {
  Row,
  Col,
  Button,
} from 'reactstrap';

import { Edit } from 'react-feather'

import SurveysDesignerQuestionsList from "./Components/SurveysDesignerQuestionsList";

import "./styles.scss";

const SurveysDesignerComponent = ({ survey, }) => {

  const {latest_version: {title, description, questions} } = survey;

  return (
    <Col className={"survey-designer"} xs={6} >
      <div className={"survey-designer_header"}>
        <div className={"d-flex"}>
          <div className={"survey-designer_header_title"}>
            Survey Designer
          </div>
          <div className={"survey-designer_header_survey-name"}>
            {title}
          </div>
        </div>
        <div className={"survey-designer_header_edit-icon"}>
          <Edit size={22} />
        </div>
      </div>

      {questions && !!questions.length ? (
        <>
          <SurveysDesignerQuestionsList questions={questions} />
          <Button
            className={"survey-designer_save-button"}
            color="primary"
            onClick={() => {}}
          >
            Save survey
          </Button>
        </>
      ) : (
        <div className="survey-designer_no-questions">
          There are no questions in this survey currently.
          Please, design a new question or click on existing question
          to select and insert question in this survey
        </div>
      )}
    </Col>
  )
};

export default SurveysDesignerComponent;
