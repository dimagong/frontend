import React, {useEffect, useState} from 'react';

import { Row, Card, CardBody, Col } from "reactstrap";
import {X, ChevronDown, Plus} from "react-feather";
import Select, { components } from "react-select";

import LoadingButton from "components/LoadingButton";


import './styles.scss'
import {useSelector} from "react-redux";
import {createLoadingSelector} from "app/selectors/loadingSelector";
import {usePrevious} from "hooks/common";
import appSlice from "app/slices/appSlice";
import {selectError} from "app/selectors";
import * as yup from "yup";
import {toast} from "react-toastify";
import {prepareSelectReviewers} from "utility/select/prepareSelectData";

const {
  assignSurveyRequest,
} = appSlice.actions;

const selectStyles = {
  control: styles => ({
    ...styles,
    backgroundColor: "white",
    border: "1px solid rgba(34, 60, 80, 0.2)",
    borderRadius: "8px",
    // This line disable the blue border
    boxShadow: "none",
    minHeight: "auto",
    cursor: "pointer",
    padding: "0 0 0 7px",
    fontSize: "11px",
    fontFamily: "Montserrat",
  }),
  placeholder: (styles) => ({
    ...styles,
    color: "#4B484D",
  }),
  input: (styles) => ({
    ...styles,

    padding: "6px 7px 6px 0",
  }),

  indicatorSeparator: () => ({display: 'none'}),
};

const DropdownIndicator = props => {
  return (
    <components.DropdownIndicator {...props}>
      <ChevronDown />
    </components.DropdownIndicator>
  );
};

const createSurveyValidation = yup.object().shape({
  interaction_version_id: yup.number().defined('Please, select survey'),
  workflow_id: yup.number().defined('Please, select workflow'),
  reviewers: yup.array().of(yup.number()).min(1, 'Please, select reviewer and click plus button to add at least one reviewer'),
});

const sortByLabel = (a, b) => a.label.localeCompare(b.label);

const SurveyAssignComponent = ({ workFlows, reviewers, surveys, isLoading, onSurveyAdd, isSurveyAssignProceed }) => {

  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [selectedReviewers, setSelectedReviewers] = useState([]);
  const [selectedWorkFlow, setSelectedWorkFlow] = useState(null);
  const [reviewerSelectValue, setReviewerSelectValue] = useState(null);

  const isSurveyAddProceeding = useSelector(createLoadingSelector([assignSurveyRequest.type], true));
  const prevSurveyAddLoadingState = usePrevious(isSurveyAddProceeding);
  const error = useSelector(selectError);

  const handleReviewerAdd = () => {
    if (reviewerSelectValue?.value) {
      setSelectedReviewers([...selectedReviewers, reviewerSelectValue.value]);
      setReviewerSelectValue(null);
    }
  };

  const handleReviewerRemove = (reviewer) => {
    setSelectedReviewers(selectedReviewers.filter(selectedReviewer => selectedReviewer.id !== reviewer.id))
  };

  const handleReviewerSelect = (value) => {
    setReviewerSelectValue(value);
  };

  const handleSurveyAdd = async () => {
    const surveyData = {
      interaction_version_id: selectedSurvey?.value?.latest_version?.id,
      workflow_id: selectedWorkFlow?.value?.id,
      reviewers: selectedReviewers.map(reviewer => reviewer.id)
    };

    const isValid = await createSurveyValidation
      .validate(surveyData)
      .catch((err) => { toast.error(err.message) });

    if (isValid) {
      onSurveyAdd(surveyData);
    }
  };

  const surveyOptions = surveys.map(survey => ({label: survey.latest_version.title, value: survey})).sort(sortByLabel);
  const workFlowsOptions = workFlows.map(workFlow => ({label: workFlow.name, value: workFlow})).sort(sortByLabel);
  const reviewersOptions = prepareSelectReviewers(reviewers).filter(({value}) => !~selectedReviewers.indexOf(value)).sort(sortByLabel);

  useEffect(() => {
    if (!isSurveyAddProceeding && prevSurveyAddLoadingState && !error) {
      setSelectedSurvey(null);
      setSelectedReviewers([]);
      setSelectedWorkFlow(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSurveyAddProceeding])

  return (
    <div className="survey-assign">
      <Col md="12" lg="12" className="p-0 ml-0">
        <div className={"survey-assign_title"}>
          Add Survey
        </div>
        <Card className="border-0 mb-0">
          <CardBody className="survey-assign_body">
            <Row>
              <Col md={4}>
                <Row className="mb-2">
                  <Col>
                    <div className="survey-assign_body_select-label">
                      Select survey
                    </div>
                    <Select
                      styles={selectStyles}
                      components={{ DropdownIndicator }}
                      options={surveyOptions}
                      value={selectedSurvey}
                      onChange={(value) => setSelectedSurvey(value)}
                      isLoading={isLoading}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="survey-assign_body_select-label">
                      Select workflow
                    </div>
                    <Select
                      styles={selectStyles}
                      components={{ DropdownIndicator }}
                      options={workFlowsOptions}
                      value={selectedWorkFlow}
                      onChange={(value) => setSelectedWorkFlow(value)}
                      isLoading={isLoading}
                    />
                  </Col>

                </Row>
              </Col>
              <Col>
                <Row className="mb-2">
                  <Col md={6}>
                    <div className="survey-assign_body_select-label">
                      Who will review the results?
                    </div>
                    <div className="survey-assign_body_reviewers-select_container">
                      <div className="survey-assign_body_reviewers-select_container_select">
                        <Select
                          styles={selectStyles}
                          components={{ DropdownIndicator }}
                          options={reviewersOptions}
                          isLoading={isLoading}
                          value={reviewerSelectValue}
                          onChange={handleReviewerSelect}
                        />
                      </div>
                      <button onClick={handleReviewerAdd}>
                        <Plus />
                      </button>
                    </div>


                  </Col>
                </Row>
                <Row>
                  <Col>
                    <div className="survey-assign_body_reviewers">
                      {selectedReviewers.map(reviewer => (
                        <div className="reviewer-tile">
                          <div className="reviewer-tile_name">
                            {`${reviewer.first_name} ${reviewer.last_name}`}
                          </div>
                          <div className="reviewer-tile_cross" onClick={() => {handleReviewerRemove(reviewer)}}>
                            <X color="white" size={15} />
                          </div>

                        </div>
                      ))}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <LoadingButton
              className="survey-assign_create-button"
              color={"primary"}
              value="Add Survey"
              isLoading={isSurveyAssignProceed}
              onClick={handleSurveyAdd}
            />
          </CardBody>
        </Card>
      </Col>
    </div>
  )
};

export default SurveyAssignComponent;
