import React, { useState, useEffect } from 'react';

import { useSelector, useDispatch } from "react-redux";

import SurveyAssignComponent from "./components/SurveyAssignComponent";
import {
  selectSurveyWorkFlowsAndReviewers,
} from "app/selectors/userSelectors";
import { createLoadingSelector } from "app/selectors/loadingSelector";

import appSlice from "app/slices/appSlice";

const {
  getSurveyWorkFlowsAndReviewersRequest,
  assignSurveyRequest,
} = appSlice.actions;

const SurveyAssign = ({ userId }) => {
  const dispatch = useDispatch();

  const isSurveyAssignDataLoading = useSelector(createLoadingSelector([getSurveyWorkFlowsAndReviewersRequest.type]));
  const isSurveyAssignProceed = useSelector(createLoadingSelector([assignSurveyRequest.type], true));
  const surveyWorkFlowsAndReviewers = useSelector(selectSurveyWorkFlowsAndReviewers);

  const {
    workflows: surveyWorkFlows = [],
    reviewers: surveyReviewers = [],
    survey_interactions: availableSurveys = [],
  } = surveyWorkFlowsAndReviewers || {};

  const [surveyAssignedReviewers, setSurveyAssignedReviewers] = useState([]);

  console.log(surveyWorkFlowsAndReviewers);

  const handleReviewerAdd = (reviewer) => {
    setSurveyAssignedReviewers([...surveyAssignedReviewers, reviewer])
  };

  const handleReviewerRemove = (reviewer) => {
    //** TODO fix filter condition after remove impolement
    setSurveyAssignedReviewers(surveyAssignedReviewers.filter((assignedReviewer) => assignedReviewer !== reviewer))
  };

  const handleSurveyAdd = (surveyData) => {
    console.log(surveyData)
    surveyData.user_id = userId;

    dispatch(assignSurveyRequest(surveyData))

  };

  useEffect(() => {
    dispatch(getSurveyWorkFlowsAndReviewersRequest())
  }, []);

  return (
    <SurveyAssignComponent
      assignedReviewers={surveyAssignedReviewers}
      onReviewerAdd={handleReviewerAdd}
      onReviewerRemove={handleReviewerRemove}
      isLoading={isSurveyAssignDataLoading}
      surveys={availableSurveys}
      workFlows={surveyWorkFlows}
      reviewers={surveyReviewers}
      onSurveyAdd={handleSurveyAdd}
      isSurveyAssignProceed={isSurveyAssignProceed}
    />
  )
};

export default SurveyAssign;
