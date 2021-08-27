import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";

import AssignedSurveyComponent from "./components/AssignedSurveyComponent";

import { selectAssignedSurveyById } from "app/selectors/userSelectors";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectError } from "app/selectors";
import { usePrevious } from "hooks/common";
import {toast} from "react-toastify";

import {appSlice} from "app/slices/appSlice";

const {
  gradeSurveyQuestionAnswerRequest,
  finishGradingRequest,
  deleteAssignedSurveyRequest,
} = appSlice.actions;

const AssignedSurvey = ({ selectedSurveyId, onSurveyClose }) => {
  const dispatch = useDispatch();

  const [isGradingReview, setIsGradingReview] = useState(false);
  const [isFinishButtonBlocked, setIsFinishButtonBlocked] = useState(false);

  const error = useSelector(selectError);
  const surveyData = useSelector(selectAssignedSurveyById(selectedSurveyId));
  const isSurveyDeleteProceeding = useSelector(createLoadingSelector([deleteAssignedSurveyRequest.type], true));

  const prevSurveyDeleteLoadingState = usePrevious(isSurveyDeleteProceeding);

  const handleQuestionAnswerGradingSave = (data) => {
    dispatch(gradeSurveyQuestionAnswerRequest({ surveyId: surveyData.id ,data}))
  };

  const handleFinishGrading = () => {
    const questionsWithTextType = surveyData.questions.filter(question => question.answer_structure.type === "text");
    const answersWithTextType = surveyData.answers.filter(answer => answer.grade_structure);

    const answersWithoutGrade = questionsWithTextType.filter(question => {
      const isGraded = surveyData.answers.some(answer => {
        if(!answer.grade_structure) return false;

        return answer.question_id === question.id && answer.grade_structure.grade !== null
      });

      return !isGraded
    });

    if (answersWithoutGrade.length) {
      toast.error("Please, grade all text answers");
      return;
    } else {

      dispatch(finishGradingRequest(surveyData.id))
    }
  };

  // Disabling of finish button doesn't work correctly
  const handleFinishButtonDisableStateChange = (newState) => {
    setIsFinishButtonBlocked(newState)
  };

  const handleForceSurveyReviewShow = () => {
    setIsGradingReview(true)
  };

  const handleForceSurveyReviewHide = () => {
    setIsGradingReview(false)
  };

  const handleAssignedSurveyDelete = () => {
    if(!window.confirm("Are you sure you want to delete this survey?")) return;

    dispatch(deleteAssignedSurveyRequest(selectedSurveyId))
  };

  let surveyStatus;

  if (!surveyData?.finished_at) {
    surveyStatus = "review"
  } else if (!surveyData?.graded_at || isGradingReview) {
    surveyStatus = 'grading'
  } else if (surveyData?.graded_at && !isGradingReview) {
    surveyStatus = "results"
  }

  useEffect(() => {
    if (!isSurveyDeleteProceeding && prevSurveyDeleteLoadingState && !error) {
      onSurveyClose();

      toast.success("Survey deleted successfully");
    }
  }, [isSurveyDeleteProceeding]);

  useEffect(() => {
    setIsGradingReview(false)
  }, [selectedSurveyId]);


  if (!surveyData) return null;

  return (
    <AssignedSurveyComponent
      surveyData={surveyData}
      status={surveyStatus}
      isGradingReview={isGradingReview && surveyData.graded_at}
      onQuestionAnswerGradingSave={handleQuestionAnswerGradingSave}
      onFinishGrading={handleFinishGrading}
      isFinishButtonDisabled={isFinishButtonBlocked}
      onFinishButtonDisableStateChange={handleFinishButtonDisableStateChange}
      onForceSurveyReviewShow={handleForceSurveyReviewShow}
      onForceSurveyReviewHide={handleForceSurveyReviewHide}
      onAssignedSurveyDelete={handleAssignedSurveyDelete}
      isSurveyDeleteProceeding={isSurveyDeleteProceeding}
    />
  )
};

export default AssignedSurvey;
