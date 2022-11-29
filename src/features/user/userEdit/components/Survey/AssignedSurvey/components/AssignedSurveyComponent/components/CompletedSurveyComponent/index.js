import React from "react";

import { Card, Button } from "reactstrap";
import moment from "moment";
import LoadingButton from "components/LoadingButton";

import "./styles.scss";
import { Check } from "react-feather";
import Checkbox from "components/@vuexy/checkbox/CheckboxesVuexy";
import {
  useSurveyByUserIdAndSurveyIdQuery,
  useSurveyShowResultMutation,
} from "../../hooks/useSurveyShowResultsQueries";

const stats = [
  {
    color: "#00BF00",
    key: "total",
    label: "Total Score",
    suffix: "%",
  },
  {
    color: "#4B484D",
    key: "percentile",
    label: "Percentile",
    suffix: "th",
  },
];

const CompletedSurveyComponent = ({
  surveyData,
  onForceSurveyReviewShow,
  onAssignedSurveyDelete,
  isSurveyDeleteProceeding,
}) => {
  stats[0].color = surveyData?.interaction_version.min_percent_pass <= surveyData.stats.total ? "#00BF00" : "#d33c30";

  const showSurveyResult = useSurveyShowResultMutation(surveyData.user_id, surveyData.id);

  const { data: surveys, isLoading: isSurveyQueryLoading } = useSurveyByUserIdAndSurveyIdQuery(
    surveyData.user_id,
    surveyData.id
  );

  const isSurveyMutationLoading = showSurveyResult.isLoading;

  const survey = surveys?.find((survey) => survey.id === surveyData.id);

  const isShowResult = survey?.isShowResult;

  const handleShowSurveyResult = (event) => {
    showSurveyResult.mutate(event.target.checked);
  };

  return (
    <Card className="survey-results">
      <div className="survey-results_stats">
        {stats.map((stat) => (
          <div key={stat.key} className="survey-results_stats_stat">
            <div className="survey-results_stats_stat_value" style={{ borderColor: stat.color, color: stat.color }}>
              {/*  TODO make round on backend*/}
              {stat.key === "totalTime"
                ? `${surveyData.stats[stat.key]}${stat.suffix}`
                : `${Math.floor(surveyData.stats[stat.key])}${stat.suffix}`}
            </div>
            <div className="survey-results_stats_stat_label">{stat.label}</div>
          </div>
        ))}
      </div>
      <div className="survey-results_marked-by">
        <div className="survey-results_marked-by_label">Marked by:</div>
        <div className="survey-results_marked-by_list">
          {surveyData.stats.marked_by.map((reviewer) => (
            <div className="survey-results_marked-by_list-tile">{`${reviewer.first_name} ${reviewer.last_name}`}</div>
          ))}
        </div>
      </div>
      <div className={"survey-results_show-checkbox"}>
        <div className={"survey-results_show-checkbox_container"}>
          <Checkbox
            disabled={isSurveyQueryLoading || isSurveyMutationLoading}
            color="primary"
            icon={<Check className="vx-icon" size={16} />}
            label="Show prospect results of survey"
            onChange={handleShowSurveyResult}
            checked={isShowResult}
          />
        </div>
      </div>
      <div className="survey-results_footer">
        <div className="survey-results_footer_graded-at">
          {`Graded: ${moment(surveyData.graded_at).format("MM/DD/YYYY")} at ${moment(surveyData.graded_at).format(
            "h:mm"
          )}`}
        </div>
        <div>
          <LoadingButton
            value="Delete survey"
            color="danger"
            isLoading={isSurveyDeleteProceeding}
            className="mr-2"
            onClick={onAssignedSurveyDelete}
          />
          <Button color="primary px-3" onClick={onForceSurveyReviewShow}>
            View Survey
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CompletedSurveyComponent;
