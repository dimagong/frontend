import React from 'react';
import { TextArea } from 'features/Surveys/Components/SurveyFormComponents'

const MultipleChoice = ({ options, correctAnswerId, onChange }) => {

  return (
    <div className={"answer multiple-choice"}>
      <div className="title">
        Mark one answer:
      </div>
      <div className="options">
        {options.map((answer, index) => (
          <div key={index} className={`option ${answer.id === correctAnswerId ? "selected" : ""}`} onClick={() => onChange(answer.id)}>
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

const FreeText = ({ onChange, answer }) => {

  return (
    <div className="answer free-text">
      <div className="title">
        Write your answer below:
      </div>
      <div>
        <TextArea
          value={answer}
          onChange={(e) => onChange(e.target.value)}
          height={7}
        />
      </div>
    </div>
  )
};

const OnboardingQuestion = ({
  displayType,
  questionNumber,
  questionData,
  onAnswerChange,
  answer,
}) => {

  const {
    body,
    answer_structure: {type, options}
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
        "multiple_choice": <MultipleChoice options={options} onChange={onAnswerChange} correctAnswerId={answer} />,
        "text": <FreeText onChange={onAnswerChange} answer={answer} />
      }[type]}
    </div>
  );
};


export default OnboardingQuestion;
