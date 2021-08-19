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
          onChange={(e) => onChange(e.target.value)}
          height={7}
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
  onAnswerChange,
  answer,
  initAnswer
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

  useEffect(() => {
    if (initAnswer) {
      onAnswerChange(initAnswer.answer)
    }
  }, [initAnswer]);

  return (
    <div className={`question question-${displayType}`}>
      <div className={"question-title"}>
        {`Question ${questionNumber}`}
      </div>
      <div className="question-time">
        <TimerComponent startTime={questionData.started_at} />
      </div>
      <div className={"question-description"}>
        {body}
      </div>

      {{
        "multiple_choice": <MultipleChoice options={options} onChange={onAnswerChange} correctAnswerId={answer} />,
        "text": <FreeText onChange={onAnswerChange} answer={answer} onClick={handleOnClick}/>
      }[type]}

      <SurveyModal
        title={"Hint"}
        isOpen={isHintOpen}
        onClose={() => setIsHintOpen(false)}
        submitBtnText={"Close"}
        onSubmit={() => setIsHintOpen(false)}
      >
        <h3 style={{fontWeight: 'initial'}}>{hint}</h3>
      </SurveyModal>
    </div>
  );
};


export default OnboardingQuestion;
