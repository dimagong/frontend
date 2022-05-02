import React, { useState } from "react";
import { Col, Row } from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";

import { useSelector, useDispatch } from "react-redux";
import { selectSurveys } from "app/selectors/userSelectors";

import ListItem from "features/home/ContextSearch/components/ListItem";
import WorkFlowsAndNotificationsList from "features/home/ContextSearch/components/WorkFlowsAndNotificationsList";

import appSlice from "app/slices/appSlice";

const { setContext, getSurveyRequest } = appSlice.actions;

const Surveys = () => {
  const dispatch = useDispatch();
  const surveys = useSelector(selectSurveys);
  const [selectedItemId, setSelectedItemId] = useState(-1);

  const formatSurveyData = (survey) => {
    return {
      id: survey.id,
      name: survey.latest_version.title,
      description: survey.latest_version.description,
      groups: [survey.organization],
    };
  };

  const handleSurveySelect = (selectedSurveyId) => {
    dispatch(getSurveyRequest(selectedSurveyId));
    setSelectedItemId(selectedSurveyId);
    dispatch(setContext("Survey"));
  };

  return (
    <Row style={{ marginBottom: "40px" }}>
      <Col className="applications">
        <div className="list-header">
          <div>Name</div>
          <div>Description</div>
          <div>Organisations</div>
        </div>

        <Scrollbars autoHeight autoHeightMax={500}>
          <div className="items-list">
            {!!surveys.length &&
              surveys.map((item, index) => (
                <ListItem
                  key={index}
                  item={formatSurveyData(item)}
                  onClick={() => {
                    handleSurveySelect(item.id);
                  }}
                  isSelected={item.id === selectedItemId}
                />
              ))}
          </div>
        </Scrollbars>
      </Col>

      <WorkFlowsAndNotificationsList context="survey" />
    </Row>
  );
};

export default Surveys;
