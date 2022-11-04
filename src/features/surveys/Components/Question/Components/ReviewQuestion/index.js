import React, { useEffect, useState } from "react";
import { TextArea } from "features/surveys/Components/SurveyFormComponents";
import { useSmallOptionsSurveyStyles } from "hooks/useSmallOptionsSurveyStyles";

const MultipleChoice = ({ options, correctAnswerId, currAnswer, prospectView }) => {
  const [IsSmallOptionsStylesUsed, setIsSmallOptionsStylesUsed] = useState(null);

  const optionsRef = React.useRef([]);

  useEffect(() => {
    optionsRef.current = optionsRef.current.slice(0, options.length);
  }, [options]);

  const DisplayOptions = ({ type }) => {
    return (
      <div
        className={`options
        ${
          IsSmallOptionsStylesUsed === null ||
          (type === "large" && IsSmallOptionsStylesUsed) ||
          (type === "small" && !IsSmallOptionsStylesUsed)
            ? "options-hidden"
            : ""
        }`}
      >
        {options.map((answer, index) => (
          <div
            key={index}
            className={`option option-${type}
            ${answer.id === correctAnswerId ? (prospectView ? "selected-green" : "selected") : ""}
            ${answer.id === currAnswer ? "curr" : ""}`}
            ref={(el) => (optionsRef.current[index] = el)}
          >
            <div className={"option-circle"} />
            <div className={"option-text"}>{answer.text}</div>
          </div>
        ))}
      </div>
    );
  };

  useSmallOptionsSurveyStyles(options, setIsSmallOptionsStylesUsed, optionsRef);

  return (
    <div className={"answer multiple-choice"}>
      <div className="title">Mark one answer:</div>

      <div className={"all-options"}>
        <DisplayOptions type={"large"} />

        <DisplayOptions type={"small"} />
      </div>
    </div>
  );
};

const FreeText = ({ answer }) => {
  return (
    <div className="answer free-text">
      <div className="title">Write your answer below:</div>
      <div>
        <TextArea value={answer ? answer : ""} onChange={() => {}} height={7} disabled />
      </div>
    </div>
  );
};

const ReviewQuestion = ({ displayType, questionNumber, questionData, currAnswer, prospectView }) => {
  let grade = currAnswer?.grade_structure?.grade;
  currAnswer = currAnswer?.answer || currAnswer;
  const {
    body,
    answer_structure: { type, options, points, max_points },
  } = questionData;

  return (
    <div className={`question question-${displayType}`}>
      <div className={"question-title"}>{`Question ${questionNumber}`}</div>
      <div className={"question-description"}>{body}</div>

      {
        {
          multiple_choice: (
            <MultipleChoice
              options={options}
              correctAnswerId={currAnswer === "-1" ? currAnswer : questionData.correct_answer}
              currAnswer={currAnswer}
              prospectView={prospectView}
            />
          ),
          text: <FreeText answer={currAnswer !== "-1" ? currAnswer : undefined} />,
        }[type]
      }

      <div className={"question-points"}>
        {grade || (!currAnswer || questionData.correct_answer === currAnswer ? points || max_points : 0)} Points
      </div>
    </div>
  );
};

export default ReviewQuestion;
