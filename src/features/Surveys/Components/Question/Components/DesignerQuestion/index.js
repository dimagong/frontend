import React, {useEffect, useState} from 'react';

import classNames from "classnames";

import { Edit } from 'react-feather'
import { Cancel } from "@material-ui/icons";
import { CheckCircle } from 'react-feather';
import { TextArea } from 'features/Surveys/Components/SurveyFormComponents'

const MultipleChoice = ({ options }) => {
  const [isSmallOptions, setIsSmallOptions] = useState(null);

  const DisplayOptions = ({type}) => {
    return (
      <div className={`options
        ${((type === 'large' && isSmallOptions)
        || (type === 'small' && isSmallOptions === false))
        ? "options-hidden" : ""}`
      }>
        {options.map((answer, index) => (
          <div key={index} className={`option option-${type} ${answer.is_correct ? "selected" : ""}`}>
            <div className={"option-circle"} />
            <div className={"option-text"}>
              {answer.text}
            </div>
          </div>
        ))}
      </div>
    )
  }

  useEffect(() => {
    let optionsElementsCollection = document.getElementsByClassName('option-small');
    let optionsElements = [].slice.call(optionsElementsCollection);
    optionsElements = optionsElements.filter(item => options.find(option => option.text === item.childNodes[1].innerHTML))
    if (optionsElements.length === 0) {
      setIsSmallOptions(null);
      return;
    }
    for (let i = 0; i < optionsElements.length; ++i) {
      if (optionsElements[i].offsetHeight > 50) {
        setIsSmallOptions(false)
        return;
      }
    }
    setIsSmallOptions(true)

  }, [window.innerWidth, options])

  return (
    <div className={"answer multiple-choice"}>
      <div className="title">
        Mark one answer:
      </div>
      <div className={'all-options'}>
        <DisplayOptions
          type={'large'}
        />

        <DisplayOptions
          type={'small'}
        />
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
