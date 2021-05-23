import React, { useState, useEffect, useRef } from 'react';

import Question from 'features/Surveys/Components/Question'

import _ from 'lodash'

import {
  Button,
} from 'reactstrap'

import {
  ChevronUp,
  ChevronDown,
} from 'react-feather'

import './styles.scss'

const SurveyDesignerQuestionListItem = ({ question, handleReorder, questionsCount, handleRemoveQuestionFromSurvey }) => {

  const questionOrder = question.latest_version.question.order;

  return (
    <div className="survey-designer_question-list_item">
      <div className="survey-designer_question-list_item_order-buttons">
        <button onClick={() => {handleReorder(question, questionOrder - 1)}} disabled={questionOrder === 0}>
          <ChevronUp size={26} color="white" />
        </button>
        <button onClick={() => {handleReorder(question, questionOrder + 1)}} disabled={(questionOrder + 1) === questionsCount}>
          <ChevronDown size={26} color="white" />
        </button>
      </div>
      <Question
        displayType={"designer"}
        question={question}
        isSurveyDesigner={true}
        questionNumber={questionOrder + 1}
        handleRemoveQuestionFromSurvey={handleRemoveQuestionFromSurvey}
      />
    </div>

  )
};


const SurveysDesignerQuestionListNoQuestionsComponent = ({ isQuestionSelected, onQuestionInsert }) => {

  return (
    <div className="survey-designer_no-questions">
      {isQuestionSelected ? (
        <Button color="primary" onClick={onQuestionInsert}>
          Insert here
        </Button>
      ) : (
        <div className="survey-designer_no-questions">
          There are no questions in this survey currently.
          Please, design a new question or click on existing question
          to select and insert question in this survey
        </div>
      )}
    </div>
  )
};

const SurveysDesignerQuestionsList = ({ questions = [], isQuestionSelected, onQuestionInsert, onQuestionsReorder, handleRemoveQuestionFromSurvey }) => {

  const questionListRef = useRef(null);


  const getMouseSomething = (e) => {
    e.stopPropagation();
  };
  //
  // const throttledMouseHandler = _.throttle(getMouseSomething, 400);
  // const debouncedMouseHandler = _.debounce(getMouseSomething, 25);
  // console.log(throttledMouseHandler, debouncedMouseHandler, "test");
  // const handleMouseMove = (e) => {
  //   // handle mouse while moving
  //   throttledMouseHandler(e);
  //
  //   // handle mouse stop
  //   debouncedMouseHandler(e)
  // };


  const handleQuestionInsert = () => {
    onQuestionInsert(0)
  };

  const sortQuestions = (questions) => {
    const orderPath = "latest_version.question.order";

    return [...questions].sort((a, b) => _.get(a, orderPath) - _.get(b, orderPath))
  };

  return (
    <div ref={questionListRef} className="survey-designer_question-list" onMouseMove={isQuestionSelected ? (e) => {}: () => {}} >
      {isQuestionSelected && questions && !!questions.length && (
        <div className="d-flex justify-content-center mb-2">
          <Button color="primary" onClick={handleQuestionInsert}>
            Insert here
          </Button>
        </div>

      )}
      {questions && !questions.length ? (
        <SurveysDesignerQuestionListNoQuestionsComponent
          isQuestionSelected={isQuestionSelected}
          onQuestionInsert={handleQuestionInsert}
        />
      ) : (
        sortQuestions(questions).map((question) => (
          <SurveyDesignerQuestionListItem
            question={question}
            handleReorder={onQuestionsReorder}
            questionsCount={questions.length}
            handleRemoveQuestionFromSurvey={handleRemoveQuestionFromSurvey}
          />
        ))
      )}
    </div>
  )
};

export default SurveysDesignerQuestionsList;
