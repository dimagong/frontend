import React, { useState, useEffect } from 'react';

import { Row } from 'reactstrap'

import { useSelector, useDispatch } from "react-redux";

import {
  selectSelectedSurveyId,
  selectSurveys,
  selectFolders,
} from "app/selectors/userSelectors";

import { createLoadingSelector } from "app/selectors/loadingSelector";

import SurveysDesignerComponent from "./Components/SurveyDesignerComponent";
import QuestionDesignerComponent from './Components/QuestionDesignerComponent';

import appSlice from "app/slices/appSlice";

const {
  getFoldersRequest,
} = appSlice.actions;

const SurveysDesigner = () => {

  const dispatch = useDispatch();

  const [selectedFolderId, setSelectedFolderId] = useState(-1);

  const surveys = useSelector(selectSurveys);
  const selectedSurveyId = useSelector(selectSelectedSurveyId);
  const folders = useSelector(selectFolders);
  const isFoldersLoading = useSelector(createLoadingSelector([getFoldersRequest.type]));


  const handleFolderSelect = (folderId) => {
    setSelectedFolderId(folderId);
  };

  useEffect(() => {
    dispatch(getFoldersRequest())
  }, []);


  if (selectedSurveyId === null) return;
  const selectedSurvey = surveys.filter((survey) => survey.id === selectedSurveyId)[0];

  return (
    <Row>
      <SurveysDesignerComponent
        survey={selectedSurvey}
      />
      <QuestionDesignerComponent
        folders={folders}
        selectedFolderId={selectedFolderId}
        onFolderSelect={handleFolderSelect}
        isFoldersLoading={isFoldersLoading}
      />
    </Row>

  )
};

export default SurveysDesigner;
