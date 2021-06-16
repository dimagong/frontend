import React from 'react';

import { CheckCircle } from 'react-feather';
import { TextArea } from 'features/Surveys/Components/SurveyFormComponents'

const MultipleChoice = ({ options }) => {

  return (
    <div className={"answer multiple-choice"}>
      <div className="title">
        Mark one answer:
      </div>
      <div className="options">
        {options.map((answer, index) => (
          <div key={index} className={`option ${answer.is_correct ? "selected" : ""}`}>
            <div className={"option-circle"} />
            <div className={"option-text"}>
              {answer.text}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
};

const FreeText = () => {

  return (
    <div className="answer free-text">
      <div className="title">
        Write your answer below:
      </div>
      <div>
        <TextArea
          value={""}
          onChange={() => {}}
          height={7}
          disabled
        />
      </div>
    </div>
  )
};

const ReviewQuestion = ({
                            displayType,
                            questionNumber,
                            questionData,
                          }) => {

  const {
    body,
    points,
    answer_structure: {type, options}
  } = questionData;


  return (
    <div className={`question question-${displayType}`}>
      <div className={"question-title"}>
        {`Question ${questionNumber}`}
      </div>
      <div className={`question-added-icon`}>
        <CheckCircle />
      </div>
      <div className={"question-description"}>
        {body}
      </div>

      {{
        "multiple_choice": <MultipleChoice options={options} />,
        "text": <FreeText />
      }[type]}

      <div className={"question-points"}>
        {/*{points} Points*/}
      </div>
    </div>
  );
};


export default ReviewQuestion;
