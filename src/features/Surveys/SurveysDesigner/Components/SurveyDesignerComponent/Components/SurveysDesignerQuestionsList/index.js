import React from 'react';

import Question from 'features/Surveys/Components/Question'

import {
  ChevronUp,
  ChevronDown,
} from 'react-feather'

import './styles.scss'

const SurveyDesignerQuestionListItem = ({ question }) => {

  return (
    <div className="survey-designer_question-list_item">
      <div className="survey-designer_question-list_item_order-buttons">
        <button>
          <ChevronUp size={26} color="white" />
        </button>
        <button>
          <ChevronDown size={26} color="white" />
        </button>
      </div>
      <Question
        displayType={"designer"}
      />
    </div>

  )
};

const SurveysDesignerQuestionsList = ({ questions = [] }) => {

  return (
    <div className="survey-designer_question-list">
      {questions && !questions.length ? (
        <div className="survey-designer_no-questions">
          There are no questions in this survey currently.
          Please, design a new question or click on existing question
          to select and insert question in this survey
        </div>
      ) : (
        questions.map((question) => (
          <SurveyDesignerQuestionListItem question={question} />
        ))
      )}
    </div>
  )
};

export default SurveysDesignerQuestionsList;
