import React from 'react';
import { TextArea } from 'features/Surveys/Components/SurveyFormComponents'

const MultipleChoice = ({ options, correctAnswerId }) => {

  return (
    <div className={"answer multiple-choice"}>
      <div className="title">
        Mark one answer:
      </div>
      <div className="options">
        {options.map((answer, index) => (
          <div key={index} className={`option ${answer.id === correctAnswerId ? "selected" : ""}`}>
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
        "multiple_choice": <MultipleChoice options={options} correctAnswerId={questionData.correct_answer} />,
        "text": <FreeText />
      }[type]}

      <div className={"question-points"}>
        {points || max_points} Points
      </div>
    </div>
  );
};


export default ReviewQuestion;
