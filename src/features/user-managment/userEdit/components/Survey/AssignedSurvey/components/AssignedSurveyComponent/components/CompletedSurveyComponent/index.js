import React from 'react';

import {Card, Button} from 'reactstrap';
import moment from "moment";

import "./styles.scss";

const stats = [
  {
    color: "#00BF00",
    key: "total",
    label: "Total Score",
    suffix: "%"
  },
  {
    color: "#7367F0",
    key: "totalTime",
    label: "Total Time",
    suffix: ""
  },
  {
    color: "#4B484D",
    key: "percentile",
    label: "Percentile",
    suffix: "th"
  },
];

const CompletedSurveyComponent = ({ surveyData, onForceSurveyReviewShow}) => {

  return (
    <Card className="survey-results">
      <div className="survey-results_stats">
        {stats.map((stat) => (
          <div key={stat.key} className="survey-results_stats_stat">
            <div className="survey-results_stats_stat_value" style={{borderColor: stat.color, color: stat.color}}>

              {/*  TODO make round on backend*/}
              {stat.key === "totalTime" ? (
                `${surveyData.stats[stat.key]}${stat.suffix}`
              ) : (
                `${Math.floor(surveyData.stats[stat.key])}${stat.suffix}`
              )}
            </div>
            <div className="survey-results_stats_stat_label">
              {stat.label}
            </div>
          </div>
        ))}

      </div>
      <div className="survey-results_marked-by">
        <div className="survey-results_marked-by_label">
          Marked by:
        </div>
        <div className="survey-results_marked-by_list">
          {surveyData.stats.marked_by.map((reviewer) => (
            <div className="survey-results_marked-by_list-tile">
              {`${reviewer.first_name} ${reviewer.last_name}`}
            </div>
          ))}
        </div>
      </div>
      <div className="survey-results_footer">
        <div className="survey-results_footer_graded-at">
          {`Graded: ${moment(surveyData.graded_at).format('MM/DD/YYYY')} at ${moment(surveyData.graded_at).format('h:mm')}`}
        </div>
        <div>
          <Button color="primary px-4" onClick={onForceSurveyReviewShow}>
            View Survey
          </Button>
        </div>
      </div>
    </Card>
  )
};

export default CompletedSurveyComponent;
