import React, {useState} from 'react';

import {
  Col,
  Button,
  Spinner,
} from 'reactstrap';

import { Edit } from 'react-feather'

import SurveysDesignerQuestionsList from "./Components/SurveysDesignerQuestionsList";

import SurveyCreateModal from "features/home/ContextSearch/SurveyCreateModal";

import LoadingButton from "components/LoadingButton";

import "./styles.scss";

const SurveysDesignerComponent = ({
  survey,
  isSurveyLoading,
  isQuestionSelected,
  onQuestionInsert,
  onQuestionsReorder,
  handleRemoveQuestionFromSurvey,
  onSurveyUpdate,
  isSurveyUpdateProceed,
}) => {

  const [isEditSurveyModalVisible, setIsEditSurveyModalVisible] = useState(false);


  const handleEditSurvey = () => {
    setIsEditSurveyModalVisible(true)
  };

  const handleSurveyUpdate = () => {
    onSurveyUpdate()
  };

  const {latest_version} = survey || {};

  return (
    <Col className={"survey-designer"} xs={6} >
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
          <SurveysDesignerQuestionsList
            questions={latest_version.latest_questions}
            isQuestionSelected={isQuestionSelected}
            onQuestionInsert={onQuestionInsert}
            onQuestionsReorder={onQuestionsReorder}
            handleRemoveQuestionFromSurvey={handleRemoveQuestionFromSurvey}
          />
          <LoadingButton
            className={"survey-designer_save-button"}
            color="primary"
            onClick={handleSurveyUpdate}
            value={"Save survey"}
            isLoading={isSurveyUpdateProceed}
          />
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
