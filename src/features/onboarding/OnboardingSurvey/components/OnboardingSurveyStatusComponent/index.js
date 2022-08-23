import "./styles.scss";

import React, { useEffect } from "react";
import { Button, Card, CardBody, Col, Row, Spinner } from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import { createLoadingSelector } from "app/selectors/loadingSelector";

import Approved from "../../../approved.svg";
import Submitted from "../../../submitted.svg";
import Review from "../../../onReview.svg";

import moment from "moment";

import { selectOnboardingSurveyStats } from "app/selectors/userSelectors";

import appSlice from "app/slices/appSlice";

import SurveyStatusTopbar from "./components/SurveyStatusTopbar";
import SurveyStatusSection from "./components/SurveyStatusSection";
import ButtonSurveyStatus from "./components/ButtonSurveyStatus";
import MessagesSurveyStatus from "./components/MessagesSurveyStatus";

// const { getSurveyByIdRequest } = appSlice.actions;

// const statusImages = {
//   approved: { img: Approved, alt: "form approved" },
//   submitted: { img: Review, alt: "form submitted" },
//   recent: { img: Submitted, alt: "form recently submitted" },
// };

const OnboardingSurveyStatusComponent = ({
  survey,
  status,
  onForceApplicationShow,
  isAllApplicationsCompleted,
  isFeedbackExist,
  children,
}) => {
  //const dispatch = useDispatch();
  //const surveyStats = useSelector(selectOnboardingSurveyStats(survey.id));
  //const isSurveyStatsLoading = useSelector(createLoadingSelector([getSurveyByIdRequest.type]));

  // useEffect(() => {
  //   if (status === "approved" && !surveyStats) {
  //     dispatch(getSurveyByIdRequest(survey.id));
  //   }
  //   // eslint-disable-next-line
  // }, [survey.id]);

  //const isSurveyPassed = surveyStats && surveyStats.total >= surveyStats.min_percent_pass;

  console.log("status", status);

  const [SurveyStatusTopbar, SurveyStatusSection, , ButtonSurveyStatusProps] = children;

  return status === "approved" ? (
    <>
      <Row className="onboarding_survey_result">
        <Col className="offset-md-1" sm={12} md={10}>
          <Card>
            <CardBody>
              {SurveyStatusTopbar}
              {SurveyStatusSection}
              {/* <SurveyStatusTopbar time={survey.graded_at} />
            <SurveyStatusSection
              isSurveyStatsLoading={isSurveyStatsLoading}
              isSurveyPassed={isSurveyPassed}
              surveyStats={surveyStats}
            /> */}
              {(isFeedbackExist || survey.is_show_result) && (
                <div className="status_description_action d-flex justify-content-center">{ButtonSurveyStatusProps}</div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  ) : (
    <>
      {/* {MessagesSurveyStatus} */}
      <MessagesSurveyStatus
        status={status}
        isAllApplicationsCompleted={isAllApplicationsCompleted}
        isFeedbackExist={isFeedbackExist}
        is_show_result={survey.is_show_result}
      >
        <ButtonSurveyStatus onForceApplicationShow={onForceApplicationShow}>View feedback</ButtonSurveyStatus>
      </MessagesSurveyStatus>
    </>
  );
};

export default OnboardingSurveyStatusComponent;
