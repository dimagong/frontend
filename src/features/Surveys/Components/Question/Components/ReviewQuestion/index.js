import React from 'react';
import { TextArea } from 'features/Surveys/Components/SurveyFormComponents'

const MultipleChoice = ({ options, correctAnswerId, currAnswer}) => {

  return (
    <div className={"answer multiple-choice"}>
      <div className="title">
        Mark one answer:
      </div>
      <div className="options">
        {options.map((answer, index) => (
          <div key={index} className={`option ${answer.id === correctAnswerId ? "selected" : ""} ${answer.id === currAnswer ? "curr" : ""}`}>
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

const FreeText = ({answer}) => {

  return (
    <div className="answer free-text">
      <div className="title">
        Write your answer below:
      </div>
      <div>
        <TextArea
          value={answer ? answer : ""}
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
                            currAnswer
                          }) => {

  const {
    body,
    answer_structure: {type, options, points, max_points}
  } = questionData;


  return (
    <div className={`question question-${displayType}`}>
      <div className={"question-title"}>
        {`Question ${questionNumber}`}
      </div>
      <div className={"question-description"}>
        {body}
      </div>

      {{
        "multiple_choice": <MultipleChoice options={options} correctAnswerId={currAnswer === '-1' ? currAnswer : questionData.correct_answer} currAnswer={currAnswer}/>,
        "text": <FreeText answer={currAnswer !== '-1' ? currAnswer : undefined}/>
      }[type]}

      <div className={"question-points"}>
        {(!currAnswer || questionData.correct_answer === currAnswer) ?  (points || max_points) : 0} Points
      </div>
    </div>
  );
};


export default ReviewQuestion;
