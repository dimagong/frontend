import React, { useState, useEffect } from 'react';

import { Row } from 'reactstrap'

import { useSelector, useDispatch } from "react-redux";

import {
  selectFolders,
  selectSelectedSurvey,
} from "app/selectors/userSelectors";

import { createLoadingSelector } from "app/selectors/loadingSelector";

import SurveysDesignerComponent from "./Components/SurveyDesignerComponent";
import QuestionDesignerComponent from './Components/QuestionDesignerComponent';

import appSlice from "app/slices/appSlice";

const {
  getFoldersRequest,
  getSurveyRequest,
  insertQuestionIntoSurvey,
  swapQuestions,
  removeQuestionFromSurvey,
  updateSurveyRequest,
} = appSlice.actions;

const SurveysDesigner = () => {

  const dispatch = useDispatch();

  const [selectedFolderId, setSelectedFolderId] = useState(-1);
  const [selectedQuestion, setSelectedQuestion] = useState(null);

  const folders = useSelector(selectFolders);



  const selectedSurvey = useSelector(selectSelectedSurvey);

  const isSurveyLoading = useSelector(createLoadingSelector([getSurveyRequest.type]));
  const isFoldersLoading = useSelector(createLoadingSelector([getFoldersRequest.type]));
  const isSurveyUpdateProceed = useSelector(createLoadingSelector([updateSurveyRequest.type], true));

  const handleFolderSelect = (folderId) => {
    setSelectedFolderId(folderId);
  };

  const handleQuestionSelectToggle = (questionData) => {
    if (questionData === selectedQuestion) {
      setSelectedQuestion(null)
    } else {
      setSelectedQuestion(questionData);
    }
  };

  const handleQuestionInsert = (insertIndex) => {

    const questionData = JSON.parse(JSON.stringify(selectedQuestion));

    questionData.latest_version.question.order = insertIndex;

    dispatch(insertQuestionIntoSurvey(questionData));
    setSelectedQuestion(null);
  };

  const surveyAddedQuestionIds = selectedSurvey?.latest_version.latest_questions.map((question) => {
    return question.latest_version.question_id
  });

  const handleQuestionOrderChange = (question, newOrder) => {
    dispatch(swapQuestions({question, newOrder}))
  };

  const handleRemoveQuestionFromSurvey = (question) => {
    dispatch(removeQuestionFromSurvey(question.latest_version.question_id));
  };

  const handleSurveyUpdate = () => {
    const {title, description, interaction_id} = selectedSurvey.latest_version;
    const surveyData = {
      title,
      description,
      interaction_id,
      question_versions: selectedSurvey.latest_version.latest_questions.map((question) => ({order: question.latest_version.question.order, question_version_id: question.latest_version.id})),
    };

    dispatch(updateSurveyRequest({data: surveyData, surveyId: selectedSurvey.latest_version.id}))
  };

  useEffect(() => {
    dispatch(getFoldersRequest())
  }, []);

  return (
    <Row>
      <SurveysDesignerComponent
        survey={selectedSurvey}
        isSurveyLoading={isSurveyLoading}
        isQuestionSelected={selectedQuestion !== null}
        onQuestionInsert={handleQuestionInsert}
        onQuestionsReorder={handleQuestionOrderChange}
        handleRemoveQuestionFromSurvey={handleRemoveQuestionFromSurvey}
        onSurveyUpdate={handleSurveyUpdate}
        isSurveyUpdateProceed={isSurveyUpdateProceed}
      />
      <QuestionDesignerComponent
        folders={folders}
        selectedFolderId={selectedFolderId}
        onFolderSelect={handleFolderSelect}
        isFoldersLoading={isFoldersLoading}
        onQuestionSelect={handleQuestionSelectToggle}
        selectedQuestionId={selectedQuestion?.latest_version.question_id}
        questionsInSurvey={surveyAddedQuestionIds}
      />
    </Row>

  )
};

export default SurveysDesigner;
