import React, { useEffect, useState } from "react";

import classNames from "classnames";

import { Edit } from "react-feather";
import { Cancel } from "@material-ui/icons";
import { CheckCircle } from "react-feather";
import { TextArea } from "features/surveys/Components/SurveyFormComponents";
import { useSmallOptionsSurveyStyles } from "hooks/useSmallOptionsSurveyStyles";

const MultipleChoice = ({ options }) => {
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
            className={`option option-${type} ${answer.is_correct ? "selected" : ""}`}
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

const FreeText = () => {
  return (
    <div className="answer free-text">
      <div className="title">Write your answer below:</div>
      <div>
        <TextArea value={""} onChange={() => {}} height={7} disabled />
      </div>
    </div>
  );
};

const DesignerQuestion = ({
  displayType,
  questionNumber,
  questionData,
  isSurveyDesigner,
  onEdit,
  onClick,
  isInSurvey,
  isSelected,
  onRemove,
}) => {
  const {
    body,
    points,
    answer_structure: { type, options },
  } = questionData.latest_version.question;

  const handleQuestionSelect = () => {
    if (isSurveyDesigner || isInSurvey) return;

    onClick(questionData);
  };

  return (
    <div
      className={classNames(`question question-${displayType}`, { added: isInSurvey, selected: isSelected })}
      onClick={handleQuestionSelect}
    >
      <div className={"question-title"}>{`Question ${questionNumber}`}</div>
      <div className="question-action">
        {isSurveyDesigner ? (
          <Cancel style={{ color: "#A7A2A9", fontSize: "26px" }} onClick={() => onRemove(questionData)} />
        ) : (
          <Edit
            onClick={(e) => {
              e.stopPropagation();
              onEdit(questionData.latest_version.question_id);
            }}
          />
        )}
      </div>
      <div className={`question-added-icon`}>
        <CheckCircle />
      </div>
      <div className={"question-description"}>{body}</div>

      {
        {
          multiple_choice: <MultipleChoice options={options} />,
          text: <FreeText />,
        }[type]
      }

      <div className={"question-points"}>{points} Points</div>
    </div>
  );
};

export default DesignerQuestion;
