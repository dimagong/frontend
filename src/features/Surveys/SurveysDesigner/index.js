import React, { useState, useEffect } from 'react';

import { Row } from 'reactstrap'

import { useSelector, useDispatch } from "react-redux";

import { usePrevious } from "hooks/common";
import { toast } from "react-toastify";

import {
  selectFolders,
  selectSelectedSurvey,
} from "app/selectors/userSelectors";

import { createLoadingSelector } from "app/selectors/loadingSelector";

import SurveysDesignerComponent from "./Components/SurveyDesignerComponent";
import QuestionDesignerComponent from './Components/QuestionDesignerComponent';

import appSlice from "app/slices/appSlice";

import {selectError} from "app/selectors";

const {
  getFoldersRequest,
  getSurveyRequest,
  insertQuestionIntoSurvey,
  swapQuestions,
  removeQuestionFromSurvey,
  updateSurveyRequest,
  deleteFolderRequest,
  deleteSurveyLatestVersionRequest,
  handleSurveyVersionSelect,
  deleteSurveyVersionRequest,
} = appSlice.actions;

const SurveysDesigner = () => {

  const dispatch = useDispatch();

  const [selectedFolderId, setSelectedFolderId] = useState(-1);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [deletingFolderIndex, setDeletingFolderIndex] = useState(-1);
  const [searchValue, setSearchValue] = useState("");

  const folders = useSelector(selectFolders);



  const selectedSurvey = useSelector(selectSelectedSurvey);

  const isSurveyLoading = useSelector(createLoadingSelector([getSurveyRequest.type]));
  const isFoldersLoading = useSelector(createLoadingSelector([getFoldersRequest.type]));
  const isSurveyUpdateProceed = useSelector(createLoadingSelector([updateSurveyRequest.type], true));
  const isFolderDeleteProceed = useSelector(createLoadingSelector([deleteFolderRequest.type], true));
  const isSurveyDeleteLatestVersionProceed = useSelector(createLoadingSelector([deleteSurveyLatestVersionRequest.type], true));
  const isSurveyDeleteVersionProceed = useSelector(createLoadingSelector([deleteSurveyVersionRequest.type], true));

  const prevFolderDeleteState = usePrevious(isFolderDeleteProceed);
  const prevSurveyDeleteLatestVersionValue = usePrevious(isSurveyDeleteLatestVersionProceed);

  const errors = useSelector(selectError);

  const handleFolderSelect = (folderId) => {
    setSelectedFolderId(folderId);
  };

  const handleSurveyVersionChange = (surveyVersion) => {

    dispatch(handleSurveyVersionSelect(surveyVersion))
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
    const {title, description, interaction_id, is_can_return} = selectedSurvey.latest_version;

    const surveyData = {
      title,
      description,
      interaction_id,
      is_can_return,
      question_versions: selectedSurvey.latest_version.latest_questions.map((question) => ({order: question.latest_version.question.order, question_version_id: question.latest_version.id})),
    };

    dispatch(updateSurveyRequest({data: surveyData, surveyId: selectedSurvey.latest_version.id}))
  };

  const handleFolderDelete = (folderId) => {

    const folder = folders.filter((item) => item.id === folderId)[0];
    if (folder.questions.length > 0) {
      toast.warn("You cannot delete folder while it has questions. Please delete all questions and try again");

      return;
    }

    if(!window.confirm("Are you sure you want to delete this folder?")) return;

    const folderIndex = folders.findIndex(folder => folder.id === folderId);
    setDeletingFolderIndex(folderIndex);

    dispatch(deleteFolderRequest(folderId))
  };

  const handleSearchValueChange = (e) => {
    setSearchValue(e.target.value);
  };

  useEffect(() => {
    if (!isSurveyDeleteLatestVersionProceed && prevSurveyDeleteLatestVersionValue && !errors) {
      dispatch(getSurveyRequest(selectedSurvey.id));
    }
  }, [isSurveyDeleteLatestVersionProceed]);

  useEffect(() => {
    if (prevFolderDeleteState === true && !errors) {
      if (deletingFolderIndex !== 0) {
        setSelectedFolderId(folders[deletingFolderIndex - 1].id)
      } else if (folders.length >= 1) {
        setSelectedFolderId(folders[deletingFolderIndex].id)
      } else {
        setSelectedFolderId(-1);
      }
    }
  }, [isFolderDeleteProceed]);

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
        onSurveyVersionChange={handleSurveyVersionChange}
      />
      <QuestionDesignerComponent
        folders={folders}
        onFolderDelete={handleFolderDelete}
        selectedFolderId={selectedFolderId}
        onFolderSelect={handleFolderSelect}
        isFoldersLoading={isFoldersLoading}
        onQuestionSelect={handleQuestionSelectToggle}
        selectedQuestionId={selectedQuestion?.latest_version.question_id}
        questionsInSurvey={surveyAddedQuestionIds}
        isFolderDeleteProceed={isFolderDeleteProceed}
        onSearchValueChange={handleSearchValueChange}
        searchValue={searchValue}
      />
    </Row>

  )
};

export default SurveysDesigner;
