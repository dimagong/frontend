import React, { useState, useEffect } from "react";
import { TextArea } from "features/Surveys/Components/SurveyFormComponents";
import HintIcon from "assets/img/svg/help-with-circle.svg";
import { useSmallOptionsSurveyStyles } from "hooks/useSmallOptionsSurveyStyles";
import CustomModal from "../../../../../../components/CustomModal";

const MultipleChoice = ({ options, correctAnswerId, onChange }) => {
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
            className={`option option-${type} ${answer.id === correctAnswerId ? "selected" : ""}`}
            onClick={() => onChange(answer.id)}
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

const FreeText = ({ onClick, onChange, answer }) => {
  return (
    <div className="answer free-text">
      <div className="title">
        Write your answer below:
        <img src={HintIcon} alt={"hint"} onClick={onClick} style={{ float: "right", cursor: "pointer" }} />
      </div>
      <div>
        <TextArea value={answer} onChange={(e) => onChange(e.target.value)} height={7} />
      </div>
    </div>
  );
};

const OnboardingQuestion = ({ displayType, questionNumber, questionData, onAnswerChange, answer, initAnswer }) => {
  const [isHintOpen, setIsHintOpen] = useState(false);

  const {
    body,
    hint,
    answer_structure: { type, options },
  } = questionData;

  const handleOnClick = () => {
    setIsHintOpen(true);
  };

  useEffect(() => {
    if (initAnswer) {
      onAnswerChange(initAnswer.answer);
    }
  }, [initAnswer]);

  return (
    <div className={`question question-${displayType}`}>
      <div className={"question-title"}>{`Question ${questionNumber}`}</div>
      <div className={"question-description"}>{body}</div>
      {
        {
          multiple_choice: <MultipleChoice options={options} onChange={onAnswerChange} correctAnswerId={answer} />,
          text: <FreeText onChange={onAnswerChange} answer={answer} onClick={handleOnClick} />,
        }[type]
      }

      <CustomModal
        title={"Hint"}
        isOpen={isHintOpen}
        onClose={() => setIsHintOpen(false)}
        submitBtnText={"Close"}
        onSubmit={() => setIsHintOpen(false)}
      >
        <h3 style={{ fontWeight: "initial", marginBottom: 50 }}>{hint}</h3>
      </CustomModal>
    </div>
  );
};

export default OnboardingQuestion;
