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
      {questions.map((question) => (
        <SurveyDesignerQuestionListItem question={question} />
      ))}
    </div>
  )
};

export default SurveysDesignerQuestionsList;
