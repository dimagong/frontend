import React, {useState, useEffect} from 'react';
import { TextArea } from 'features/Surveys/Components/SurveyFormComponents'
import { getTimeDifference } from "utility/common";
import SurveyModal from "../../../SurveyModal";
import HintIcon from "assets/img/svg/help-with-circle.svg"

const MultipleChoice = ({ options, correctAnswerId, onChange }) => {
  const [isSmallOptions, setIsSmallOptions] = useState(null);

  const DisplayOptions = ({type}) => {
    return (
      <div className={`options
        ${((type === 'large' && isSmallOptions)
        || (type === 'small' && isSmallOptions === false))
        ? "options-hidden" : ""}`
      }>
        {options.map((answer, index) => (
          <div key={index} className={`option option-${type} ${answer.id === correctAnswerId ? "selected" : ""}`}
               onClick={() => onChange(answer.id)}>
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
    let options = document.getElementsByClassName('option-small');
    if (options.length === 0) {
      setIsSmallOptions(null);
      return;
    }
    for (let i = 0; i < options.length; ++i) {
      if (options[i].offsetHeight > 50) {
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
        <h3 style={{fontWeight: 'initial', marginBottom: 50}}>{hint}</h3>
      </SurveyModal>
    </div>
  );
};


export default OnboardingQuestion;
