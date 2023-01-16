import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import AssignedSurveyComponent from "./components/AssignedSurveyComponent";

import { selectAssignedSurveyById } from "app/selectors/userSelectors";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { selectError } from "app/selectors";
import { useCallbackOnLoad, usePrevious } from "hooks/common";
import { toast } from "react-toastify";

import { appSlice } from "app/slices/appSlice";

import { useGradeSurveyQuestionMutation } from "./components/AssignedSurveyComponent/hooks/useGradeSurveyQuestionMutation";

const { finishGradingRequest, deleteAssignedSurveyRequest, addFeedbackToQuestionRequest } = appSlice.actions;

const checkGradeFields = (surveyData) => {
  const questionsWithTextType = surveyData.questions.filter((question) => question.answer_structure.type === "text");

  const answersWithoutGrade = questionsWithTextType.filter((question) => {
    const isGraded = surveyData.answers.some((answer) => {
      if (!answer.grade_structure) return false;

      return answer.question_id === question.id && answer.grade_structure.grade !== null;
    });
    return !isGraded;
  });
  return !(answersWithoutGrade.length > 0);
};

const AssignedSurvey = ({ selectedSurveyId, onSurveyClose }) => {
  const dispatch = useDispatch();

  const [isGradingReview, setIsGradingReview] = useState(false);
  const [isFinishButtonBlocked, setIsFinishButtonBlocked] = useState(false);

  const error = useSelector(selectError);
  const surveyData = useSelector(selectAssignedSurveyById(selectedSurveyId));
  const isSurveyDeleteProceeding = useSelector(createLoadingSelector([deleteAssignedSurveyRequest.type], true));
  const isFeedbackSubmitProceeding = useSelector(createLoadingSelector([addFeedbackToQuestionRequest.type], true));

  useCallbackOnLoad([finishGradingRequest.type], () => setIsFinishButtonBlocked(false), true);

  useEffect(() => {
    const isGradedAllAnswers = surveyData ? checkGradeFields(surveyData) : false;
    setIsFinishButtonBlocked(!isGradedAllAnswers);
  }, [surveyData]);

  const prevSurveyDeleteLoadingState = usePrevious(isSurveyDeleteProceeding);

  const { isLoading: isLoadingGradeSurveyQuestion, mutate: mutateGradeSurveyQuestion } = useGradeSurveyQuestionMutation(
    { surveyId: surveyData?.id }
  );

  const handleQuestionAnswerGradingSave = (data) => {
    mutateGradeSurveyQuestion(data);
  };

  const handleFinishGrading = () => {
    dispatch(finishGradingRequest(surveyData.id));
  };

  const handleFeedbackSubmit = (feedback, questionId) => {
    dispatch(
      addFeedbackToQuestionRequest({
        surveyId: selectedSurveyId,
        data: {
          message: feedback,
          question_id: questionId,
        },
      })
    );
  };

  const handleForceSurveyReviewShow = () => {
    setIsGradingReview(true);
  };

  const handleForceSurveyReviewHide = () => {
    setIsGradingReview(false);
  };

  const handleAssignedSurveyDelete = () => {
    if (!window.confirm("Are you sure you want to delete this survey?")) return;

    dispatch(deleteAssignedSurveyRequest(selectedSurveyId));
  };

  let surveyStatus;

  if (!surveyData?.finished_at) {
    surveyStatus = "review";
  } else if (!surveyData?.graded_at || isGradingReview) {
    surveyStatus = "grading";
  } else if (surveyData?.graded_at && !isGradingReview) {
    surveyStatus = "results";
  }

  useEffect(() => {
    if (!isSurveyDeleteProceeding && prevSurveyDeleteLoadingState && !error) {
      onSurveyClose();

      toast.success("Survey deleted successfully");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSurveyDeleteProceeding]);

  useEffect(() => {
    setIsGradingReview(false);
  }, [selectedSurveyId]);

  if (!surveyData) return null;

  return (
    <AssignedSurveyComponent
      isFeedbackSubmitProceeding={isFeedbackSubmitProceeding}
      onFeedbackSubmit={handleFeedbackSubmit}
      surveyData={surveyData}
      status={surveyStatus}
      isGradingReview={isGradingReview && surveyData.graded_at}
      onQuestionAnswerGradingSave={handleQuestionAnswerGradingSave}
      onFinishGrading={handleFinishGrading}
      isFinishButtonDisabled={isFinishButtonBlocked}
      onForceSurveyReviewShow={handleForceSurveyReviewShow}
      onForceSurveyReviewHide={handleForceSurveyReviewHide}
      onAssignedSurveyDelete={handleAssignedSurveyDelete}
      isSurveyDeleteProceeding={isSurveyDeleteProceeding}
      isLoadingGradeSurveyQuestion={isLoadingGradeSurveyQuestion}
    />
  );
};

export default AssignedSurvey;
