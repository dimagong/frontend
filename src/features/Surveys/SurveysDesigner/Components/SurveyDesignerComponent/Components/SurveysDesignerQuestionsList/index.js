import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

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
        displayType={"designer-view"}
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
        <Button className="px-5" color="primary" onClick={() => {onQuestionInsert(0)}}>
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

  const [breakPoints, setBreakPoints] = useState([]);

  const [insertButtonPosition, setInsertButtonPosition] = useState(-1);


  // Return distance between top edge of questions list and top edge of app
  const getListTopOffset = () => {
    const contentWrapper = document.getElementsByClassName("content-wrapper")[0];
    const wrapperStyles = contentWrapper.currentStyle || window.getComputedStyle(contentWrapper);
    const wrapperTopMargin = wrapperStyles.marginTop;

    const containerTopOffset = contentWrapper.getBoundingClientRect().top;
    const listTop = ReactDOM.findDOMNode(questionListRef.current).getBoundingClientRect().top;

    let listOffsetTop;

    if (listTop < 0) {
      listOffsetTop = Math.abs(containerTopOffset) + parseInt(wrapperTopMargin, 10) + listTop
    } else {
      listOffsetTop = parseInt(wrapperTopMargin, 10) - Math.abs(containerTopOffset) + listTop
    }

    return Math.round(listOffsetTop);
  };

  const handleInsertButtonAppearance = (e) => {

    const pageScrollY = document.getElementsByClassName("scrollbar-container")[0].firstChild.scrollTop;

    const y = e.pageY + pageScrollY;

    if(breakPoints.length) {
      for (let i = 0; i < breakPoints.length; i++) {

        let bp = breakPoints[i];

        if (y < bp && i === 0) {
          setInsertButtonPosition(0);
          break;
        } else if (y > bp && i === breakPoints.length) {
          setInsertButtonPosition(breakPoints.length - 1);
          break;
        } else if (y < bp && i !== 0) {
          setInsertButtonPosition(i - 1);
          break;
        }
      }

    }
  };

  const debouncedMouseMoveHandler = _.debounce(handleInsertButtonAppearance, 10);

  const handleQuestionInsert = () => {
    onQuestionInsert(insertButtonPosition)
  };

  const sortQuestions = (questions) => {
    const orderPath = "latest_version.question.order";

    //sort changes the original array, so we make copy to prevent state mutation;
    return [...questions].sort((a, b) => _.get(a, orderPath) - _.get(b, orderPath))
  };

  const getBreakpointsForInsertButton = (elements) => {
    const result = [];

    const listTopOffset = getListTopOffset();

    // First point is the top edge of our list
    result.push(listTopOffset);

    for (let i = 0; i < elements.length; i++) {
      let el = elements[i];
      const height = el.offsetHeight; // height without margin

      // For some reason offsetTop get offset to wrong parent and return 100 for the first item
      const elementOffsetFromPageTopEdge = el.offsetTop - 100; // distance between page top edge and element top edge

      // Get middle of the question item
      const breakPoint = (height / 2) + elementOffsetFromPageTopEdge + listTopOffset;
      result.push(breakPoint)
    }

    // Last point is the bottom edge of our list
    result.push(ReactDOM.findDOMNode(questionListRef.current).offsetHeight + listTopOffset);

    setBreakPoints(result)
  };


  useEffect(() => {
    const elements = ReactDOM.findDOMNode(questionListRef.current).getElementsByClassName("survey-designer_question-list_item");
    getBreakpointsForInsertButton(elements)
  }, [questions, isQuestionSelected]);

  return (
    <div
      ref={questionListRef}
      className="survey-designer_question-list"
      onMouseMove={isQuestionSelected ?
        (e) => {e.persist(); debouncedMouseMoveHandler(e)} : () => {}}
    >
      {questions && !questions.length ? (
        <SurveysDesignerQuestionListNoQuestionsComponent
          isQuestionSelected={isQuestionSelected}
          onQuestionInsert={handleQuestionInsert}
        />
      ) : (
        <>
          {sortQuestions(questions).map((question, index) => (
            <>
              {index === insertButtonPosition && isQuestionSelected && (
                <div className="question-insert-button">
                  <Button color="primary" className="px-5" onClick={handleQuestionInsert}>
                    Insert here
                  </Button>
                </div>
              )}
              <SurveyDesignerQuestionListItem
                question={question}
                handleReorder={onQuestionsReorder}
                questionsCount={questions.length}
                handleRemoveQuestionFromSurvey={handleRemoveQuestionFromSurvey}
              />
            </>
          ))}
          {isQuestionSelected && questions.length <= insertButtonPosition && (
            <div className="question-insert-button mb-0">
              <Button color="primary" className="px-5" onClick={handleQuestionInsert}>
                Insert here
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
};

export default SurveysDesignerQuestionsList;
