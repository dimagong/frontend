import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from "react-redux";

import AssignedSurveyComponent from "./components/AssignedSurveyComponent";

import { selectAssignedSurveyById } from "app/selectors/userSelectors";

import {appSlice} from "app/slices/appSlice";
import {toast} from "react-toastify";

const {
  gradeSurveyQuestionAnswerRequest,
  finishGradingRequest,
} = appSlice.actions;

const AssignedSurvey = ({ selectedSurveyId }) => {
  const dispatch = useDispatch();

  const [isGradingReview, setIsGradingReview] = useState(false);
  const [isFinishButtonBlocked, setIsFinishButtonBlocked] = useState(false);

  const surveyData = useSelector(selectAssignedSurveyById(selectedSurveyId));


  const handleQuestionAnswerGradingSave = (data) => {
    dispatch(gradeSurveyQuestionAnswerRequest({ surveyId: surveyData.id ,data}))
  };

  const handleFinishGrading = () => {
    const questionsWithTextType = surveyData.questions.filter(question => question.answer_structure.type === "text");
    const answersWithTextType = surveyData.answers.filter(answer => answer.grade_structure);

    const answersWithoutGrade = questionsWithTextType.filter(question => {
      const isGraded = surveyData.answers.some(answer => {
        if(!answer.grade_structure) return false;
        // console.log(answer.grade_structure.grade, typeof answer.grade_structure.grade, answer.question_id === question.id && !answer.grade_structure.grade);
        console.log(answer.question_id === question.id, answer.grade_structure.grade);
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



  let surveyStatus;

  if (!surveyData.finished_at) {
    surveyStatus = "review"
  } else if (!surveyData.graded_at || isGradingReview) {
    surveyStatus = 'grading'
  } else if (surveyData.graded_at && !isGradingReview) {
    surveyStatus = "results"
  }

  console.log("IS GRADING", isGradingReview);

  useEffect(() => {
    setIsGradingReview(false)
  }, [selectedSurveyId]);

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
    />
  )
};

export default AssignedSurvey;
