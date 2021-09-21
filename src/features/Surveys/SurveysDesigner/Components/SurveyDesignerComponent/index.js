import React, { useState, useEffect } from 'react';

import { useDispatch, useSelector } from "react-redux";

import { usePrevious } from "hooks/common";

import { selectError } from "app/selectors";
import { selectSurveyVersions } from "app/selectors/userSelectors";
import { createLoadingSelector } from "app/selectors/loadingSelector";

import {
  Col,
  Spinner,
} from 'reactstrap';

import { Edit } from 'react-feather'

import SurveysDesignerQuestionsList from "./Components/SurveysDesignerQuestionsList";
import SurveyCreateModal from "features/home/ContextSearch/SurveyCreateModal";
import LoadingButton from "components/LoadingButton";
import ChevronUpButton from "components/ArrowButton";
import { Scrollbars } from 'react-custom-scrollbars';

import "./styles.scss";

import appSlice from "app/slices/appSlice";
import {Select} from "../../../Components/SurveyFormComponents";
import {HEADER_HEIGHT} from "constants/header";

const {
  getSurveyVersionsRequest,
  deleteSurveyRequest,
  deleteSurveyLatestVersionRequest,
  deleteSurveyVersionRequest,
  setContext,
  updateSurveyMainDataRequest,
} = appSlice.actions;

const SurveysDesignerComponent = ({
  survey,
  isSurveyLoading,
  isQuestionSelected,
  onQuestionInsert,
  onQuestionsReorder,
  handleRemoveQuestionFromSurvey,
  onSurveyUpdate,
  isSurveyUpdateProceed,
  onSurveyVersionChange,
}) => {
  const dispatch = useDispatch();

  const [isEditSurveyModalVisible, setIsEditSurveyModalVisible] = useState(false);
  const [surveyVersion, setSurveyVersion] = useState(null);

  const isSurveyVersionsLoading = useSelector(createLoadingSelector([getSurveyVersionsRequest.type]));
  const isSurveyDeleteProceed = useSelector(createLoadingSelector([deleteSurveyRequest.type], true));
  const isSurveyDeleteLatestVersionProceed = useSelector(createLoadingSelector([deleteSurveyLatestVersionRequest.type], true));
  const isSurveyDeleteVersionProceed = useSelector(createLoadingSelector([deleteSurveyVersionRequest.type], true));
  const isSurveyMainDataUpdateProceed = useSelector(createLoadingSelector([updateSurveyMainDataRequest.type], true));

  const error = useSelector(selectError);
  const surveyVersions = useSelector(selectSurveyVersions);


  const prevSurveyLoadingValue = usePrevious(isSurveyLoading);
  const prevSurveyUpdateProceed = usePrevious(isSurveyUpdateProceed);
  const prevSurveyMainDataUpdateProceed = usePrevious(isSurveyMainDataUpdateProceed);

  const handleEditSurvey = () => {
    setIsEditSurveyModalVisible(true)
  };

  const handleSurveyUpdate = () => {
    onSurveyUpdate()
  };

  const {latest_version} = survey || {};

  const handleSurveyVersionChange = (value) => {
    const selectedVersion = surveyVersions.filter(version => version.id === value.value)[0];
    setSurveyVersion(value);
    onSurveyVersionChange(selectedVersion);
  };

  const handleSurveyVersionDelete = () => {

    if(!window.confirm("Are you sure you want to delete this version?")) return;

    const selectedVersion = surveyVersions.filter(version => version.version === survey.latest_version.version)[0];

    if (selectedVersion.is_latest_version) {
      if (surveyVersions.length === 1) {
        dispatch(deleteSurveyRequest(selectedVersion.id));
      } else {
        dispatch(deleteSurveyLatestVersionRequest(selectedVersion.id))
      }
    } else {
      dispatch(deleteSurveyVersionRequest(selectedVersion.id))
    }
  };

  const handleSurveyHide = () => {
    dispatch(setContext(null))
  };

  useEffect(() => {
    if (!isSurveyMainDataUpdateProceed && prevSurveyMainDataUpdateProceed && !error) {

      setSurveyVersion({value: survey.latest_version.id, label: survey.latest_version.current_version})
    }
  }, [isSurveyMainDataUpdateProceed]);

  useEffect(() => {
    if (!isSurveyUpdateProceed && prevSurveyUpdateProceed && !error) {
      dispatch(getSurveyVersionsRequest(survey.id));
      setSurveyVersion({value: survey.latest_version.id, label: survey.latest_version.current_version})
    }
  }, [isSurveyUpdateProceed]);

  useEffect(() => {
    if(!isSurveyLoading && prevSurveyLoadingValue && !error) {
      dispatch(getSurveyVersionsRequest(survey.id));
      setSurveyVersion({value: survey.latest_version.id, label: survey.latest_version.current_version})
    }
  }, [isSurveyLoading]);

  const isDeleteProceed = isSurveyDeleteProceed
                          || isSurveyDeleteLatestVersionProceed
                          || isSurveyDeleteVersionProceed;

  return (
    <Col className={"survey-designer"} xs={6} >
      <div className={"survey-designer_hide-survey"}>
        <ChevronUpButton onClick={handleSurveyHide} />
      </div>

      <div className={"survey-designer_header"}>
        <div className={"d-flex"}>
          <div className={"survey-designer_header_title"}>
            Survey Designer
          </div>
          <div className={"survey-designer_header_survey-name"}>
            {!isSurveyLoading && latest_version.title}
          </div>
        </div>
        <div className={"survey-designer_header_edit-icon"}>
          <Edit size={22}
            onClick={handleEditSurvey}
          />
        </div>
      </div>

      {!isSurveyLoading ? (
        <>
        <Scrollbars autoHeight autoHeightMax={window.innerHeight - HEADER_HEIGHT}>
          <div className={'survey-designer-scroll'}>
            <div className="survey-designer_version-select">
              <Select
                value={surveyVersion}
                displayType="versionSelect"
                isSearchable={false}
                onChange={handleSurveyVersionChange}
                isLoading={isSurveyVersionsLoading}
                options={surveyVersions && surveyVersions.map((version) => ({value: version.id, label: version.current_version})).reverse()}
              />
            </div>
            <SurveysDesignerQuestionsList
              questions={latest_version.latest_questions}
              isQuestionSelected={isQuestionSelected}
              onQuestionInsert={onQuestionInsert}
              onQuestionsReorder={onQuestionsReorder}
              handleRemoveQuestionFromSurvey={handleRemoveQuestionFromSurvey}
            />
            <div className="survey-designer_action-buttons">
              <LoadingButton
                className={"survey-designer_action-buttons_delete-button px-4"}
                color="secondary"
                onClick={handleSurveyVersionDelete}
                value={"Delete survey"}
                isLoading={isDeleteProceed}
              />
              <LoadingButton
                className={"survey-designer_action-buttons_save-button"}
                color="primary"
                onClick={handleSurveyUpdate}
                value={"Save survey"}
                isLoading={isSurveyUpdateProceed}
              />
            </div>
          </div>
        </Scrollbars>
        </>
      ) : (
        <div className="survey-designer_loading">
          <Spinner color="primary" size={40} />
        </div>
      )}

      <SurveyCreateModal
        isOpen={isEditSurveyModalVisible}
        onClose={() => setIsEditSurveyModalVisible(false)}
        isEdit={true}
        surveyData={survey}
      />
    </Col>
  )
};

export default SurveysDesignerComponent;
