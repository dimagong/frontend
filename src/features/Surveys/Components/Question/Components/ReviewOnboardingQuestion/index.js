import React, {useState, useEffect} from 'react';
import { TextArea } from 'features/Surveys/Components/SurveyFormComponents'
import { getTimeDifference } from "utility/common";
import SurveyModal from "../../../SurveyModal";
import HintIcon from "assets/img/svg/help-with-circle.svg"

const MultipleChoice = ({ options, correctAnswerId, onChange }) => {

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

const FreeText = ({ onClick, onChange, answer }) => {

  return (
    <div className="answer free-text">
      <div className="title">
        Write your answer below:
        <img
          src={HintIcon}
          alt={'hint'}
          onClick={onClick}
          style={{float: 'right', cursor: 'pointer'}}
        />
      </div>
      <div>
        <TextArea
          value={answer}
          height={7}
          disabled
        />
      </div>
    </div>
  )
};

const TimerComponent = ({startTime}) => {
  const [stopwatchTime, setStopwatchTime] = useState(getTimeDifference(startTime));

  setInterval(() => setStopwatchTime(getTimeDifference(startTime)), 1000);

  return stopwatchTime;
};

const OnboardingQuestion = ({
                              displayType,
                              questionNumber,
                              questionData,
                              currAnswer,
                            }) => {

  const [isHintOpen, setIsHintOpen] = useState(false);

  const {
    body,
    hint,
    answer_structure: {type, options}
  } = questionData;

  const handleOnClick = () => {
    setIsHintOpen(true)
  };

  return (
    <div className={`question question-${displayType}`}>
      <div className={"question-title"}>
        {`Question ${questionNumber}`}
      </div>
      <div className="question-time">
        {getTimeDifference(currAnswer.started_at, currAnswer.finished_at)}
      </div>
      <div className={"question-description"}>
        {body}
      </div>

      {{
        "multiple_choice": <MultipleChoice options={options} correctAnswerId={currAnswer.answer} />,
        "text": <FreeText answer={currAnswer.answer} onClick={handleOnClick}/>
      }[type]}

      <SurveyModal
        title={"Hint"}
        isOpen={isHintOpen}
        onClose={() => setIsHintOpen(false)}
        submitBtnText={"Close"}
        onSubmit={() => setIsHintOpen(false)}
      >
        <h3 style={{fontWeight: 'initial', marginBottom: 50}}>{hint}</h3>
      </SurveyModal>
    </div>
  );
};


export default OnboardingQuestion;
