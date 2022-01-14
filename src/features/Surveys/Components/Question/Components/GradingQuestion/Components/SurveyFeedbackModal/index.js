import React, {useState, useEffect} from 'react';
import {TextArea} from "../../../../../SurveyFormComponents";
import SurveyModal from "../../../../../SurveyModal";
import { usePrevious } from "hooks/common";
import {useSelector} from "react-redux";

import {selectError} from "app/selectors";

const SurveyFeedbackModal = ({
  isOpen,
  onClose,
  isSubmitProceed,
  onSubmit,
  initFeedback,
  questionId,
}) => {

  const [feedback, setFeedback] = useState("");

  const error = useSelector(selectError);
  const isSubmitProceedPrevState = usePrevious(isSubmitProceed);

  const handleClose = () => {
    setFeedback("");
    onClose();
  };

  const handleSubmit = () => {
    onSubmit(feedback, questionId);
  };

  useEffect(() => {
    if (initFeedback && isOpen) {
      setFeedback(initFeedback);
    }
  }, [isOpen, initFeedback]);

  useEffect(() => {
    if(!isSubmitProceed && isSubmitProceedPrevState && !error) {
      handleClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitProceed]);

  return (
    <SurveyModal
      isOpen={isOpen}
      onClose={handleClose}
      submitBtnText={"Submit"}
      isSubmitProceed={isSubmitProceed}
      onSubmit={handleSubmit}
      title={"Feedback"}
      className="survey_feedback_modal"
    >
      <div className="survey_feedback_modal-body">
        <label className="survey_feedback_modal-body-label" >
          Enter your feedback below
        </label>
        <TextArea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          name={"survey question feedback"}
          height={8}
          disabled={isSubmitProceed}
        />
      </div>
    </SurveyModal>
  )
};

export default SurveyFeedbackModal;
