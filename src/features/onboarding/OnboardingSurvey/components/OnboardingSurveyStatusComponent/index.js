import React, { useEffect } from "react";
import { Button, Card, CardBody, Col, Row, Spinner } from "reactstrap";

import { useDispatch, useSelector } from "react-redux";
import { createLoadingSelector } from "app/selectors/loadingSelector";

import Approved from "../../../approved.svg";
import Submitted from "../../../submitted.svg";
import Review from "../../../onReview.svg";

import moment from "moment";

import "./styles.scss";

import { selectOnboardingSurveyStats } from "app/selectors/userSelectors";

import appSlice from "app/slices/appSlice";

const { getSurveyByIdRequest } = appSlice.actions;

const statusImages = {
  approved: { img: Approved, alt: "form approved" },
  submitted: { img: Review, alt: "form submitted" },
  recent: { img: Submitted, alt: "form recently submitted" },
};

const OnboardingSurveyStatusComponent = ({
  survey,
  status,
  onForceApplicationShow,
  isAllApplicationsCompleted,
  isFeedbackExist,
}) => {
  const dispatch = useDispatch();
  const surveyStats = useSelector(selectOnboardingSurveyStats(survey.id));
  const isSurveyStatsLoading = useSelector(createLoadingSelector([getSurveyByIdRequest.type]));

  useEffect(() => {
    if (status === "approved" && !surveyStats) {
      dispatch(getSurveyByIdRequest(survey.id));
    }
    // eslint-disable-next-line
  }, [survey.id]);

  const isSurveyPassed = surveyStats && surveyStats.total > surveyStats.min_percent_pass;

  if (status === "approved") {
    return (
      <Row className="onboarding_survey_result">
        <Col className="offset-md-1" sm={12} md={10}>
          <Card>
            <CardBody>
              <span className="onboarding_survey_result-grade_time">
                Graded {moment(survey.graded_at).format("DD/MM/YYYY [at] HH:ss")}
              </span>

              <div className={`onboarding_survey_result-stats ${isSurveyStatsLoading ? "stats-loading" : ""}`}>
                <div className="onboarding_survey_result-stats_stat">
                  <div
                    className="onboarding_survey_result-stats_stat_value"
                    style={
                      isSurveyPassed
                        ? { borderColor: "#00BF00", color: "#00BF00" }
                        : { borderColor: "#d33c30", color: "#d33c30" }
                    }
                  >
                    {(surveyStats && !isSurveyStatsLoading && (isSurveyPassed ? "Pass" : "FAIL")) || (
                      <Spinner style={{ fontSize: "18px" }} size={22} color={"primary"} />
                    )}
                  </div>
                  <div className="onboarding_survey_result-stats_stat_label">Total Score</div>
                </div>

                <div className="onboarding_survey_result-stats_stat">
                  <div
                    className="onboarding_survey_result-stats_stat_value"
                    style={{ borderColor: "#7367F0", color: "#7367F0" }}
                  >
                    {(surveyStats && `${surveyStats.totalTime}`) || (
                      <Spinner style={{ fontSize: "18px" }} size={22} color={"primary"} />
                    )}
                  </div>
                  <div className="onboarding_survey_result-stats_stat_label">Total Time</div>
                </div>
              </div>
              {isFeedbackExist && (
                <div className="status_description_action d-flex justify-content-center">
                  <Button
                    className={"status_description_action_show-button"}
                    onClick={() => onForceApplicationShow(true)}
                    color="primary"
                  >
                    View feedback
                  </Button>
                </div>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    );
  }

  return (
    <div className={`status ${status}`}>
      <div className={"status_image"}>
        <img src={statusImages[status].img} alt={statusImages[status].alt} />
      </div>
      <div className={"status_description"}>
        {
          {
            submitted: (
              <>
                <h1>Thank you</h1>
                <div>You have successfully submitted this questionnaire, and it is currently under review.</div>
                <div>
                  <span className="font-weight-bold">What happens next?</span>
                  <br />
                  You will receive a notification once it has been graded with any relevant feedback if necessary.
                </div>
              </>
            ),
            approved: (
              <>
                <h1>Success!</h1>
                <div>Our review of your information has completed.</div>
                <div>
                  You can now continue via the ValidPath Portal and we will be in touch with you shortly to discuss
                   next steps.
                </div>
              </>
            ),
            recent: (
              <>
                <h1>Submitted</h1>
                <div>
                  Thank you.
                  <br />
                  <br />
                  Your information has been submitted.
                </div>
                <div>We will review your application and get back shortly.</div>
              </>
            ),
          }[status]
        }

        {!isAllApplicationsCompleted && (
          <div>
            {
              {
                submitted: "In the interim, please continue with any remaining forms.",
                approved: "Please continue with the remaining applications to complete your onboarding process.",
                recent:
                  "In the meantime, please continue with the remaining applications to complete your onboarding process.",
              }[status]
            }
          </div>
        )}
        {status === "approved" ? (
          <div>
            <br />
            Thank you,
            <br />
            The ValidPath Team
          </div>
        ) : (
          <div>
            <br />
            Sincerely,
            <br />
            The ValidPath Team
          </div>
        )}

        {/*Do not render for surveys*/}
        {isFeedbackExist && (
          <div className={"status_description_action"}>
            <Button
              className={"status_description_action_show-button"}
              onClick={() => onForceApplicationShow(true)}
              color="primary"
            >
              View feedback
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingSurveyStatusComponent;
