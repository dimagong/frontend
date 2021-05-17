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
} = appSlice.actions;

const SurveysDesigner = () => {

  const dispatch = useDispatch();

  const [selectedFolderId, setSelectedFolderId] = useState(-1);


  const folders = useSelector(selectFolders);



  const selectedSurvey = useSelector(selectSelectedSurvey);

  const isSurveyLoading = useSelector(createLoadingSelector([getSurveyRequest.type]));
  const isFoldersLoading = useSelector(createLoadingSelector([getFoldersRequest.type]));


  const handleFolderSelect = (folderId) => {
    setSelectedFolderId(folderId);
  };

  useEffect(() => {
    dispatch(getFoldersRequest())
  }, []);



  return (
    <Row>
      <SurveysDesignerComponent
        survey={selectedSurvey}
        isSurveyLoading={isSurveyLoading}
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
