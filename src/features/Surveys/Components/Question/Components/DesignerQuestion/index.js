import React from 'react';

import classNames from "classnames";

import { Edit } from 'react-feather'
import { Cancel } from "@material-ui/icons";
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
    answer_structure: {type, options}
  } = questionData.latest_version.question;

  const handleQuestionSelect = () => {
    if (isSurveyDesigner || isInSurvey) return;

    onClick(questionData);
  };

  return (
    <div className={classNames(`question question-${displayType}`, {added: isInSurvey, selected: isSelected})}
         onClick={handleQuestionSelect}
    >
      <div className={"question-title"}>
        {`Question ${questionNumber}`}
      </div>
      <div className="question-action">
        {isSurveyDesigner ? (
          <Cancel style={{color: "#A7A2A9", fontSize: "26px"}} onClick={() => onRemove(questionData)} />
        ) : (
          <Edit onClick={(e) => {e.stopPropagation(); onEdit(questionData.latest_version.question_id)}} />
        )}
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
        {points} Points
      </div>
    </div>
  );
};


export default DesignerQuestion;
