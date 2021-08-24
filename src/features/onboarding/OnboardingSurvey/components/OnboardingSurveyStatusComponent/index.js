import React from 'react';
import {Button} from "reactstrap";
import LoadingButton from "components/LoadingButton";

import Approved from '../../../approved.svg'
import Submitted from '../../../submitted.svg'
import Review from '../../../onReview.svg'


const statusImages = {
  approved: {img: Approved, alt: "form approved"},
  submitted: {img: Review, alt: "form submitted"},
  recent: {img: Submitted, alt: "form recently submitted"},
};

const OnboardingSurveyStatusComponent = ({status, onForceApplicationShow, isAllApplicationsCompleted, isFeedbackExist}) => {

  return (
    <div className={`status ${status}`}>
      <div className={"status_image"}>
        <img src={statusImages[status].img} alt={statusImages[status].alt} />
      </div>
      <div className={"status_description"}>

        {{submitted: <>
            <h1>Thank you</h1>
            <div>You have successfully submitted this questionnaire, and it is currently under review.</div>
            <div><span className="font-weight-bold">What happens next?</span><br />You will receive a notification once it has been graded with any relevant feedback if necessary.</div>
          </>,
          approved: <>
            <h1>Success!</h1>
            <div>Our review of your information has completed.</div>
            <div>You can now continue via the ValidPath Portal and we will be in touch with you shortly to discuss  next steps.</div>
          </> ,
          recent: <>
            <h1>Submitted</h1>
            <div>Thank you.<br/><br/>Your information has been submitted.</div>
            <div>We will review your application and get back shortly.</div>
          </>,
        }[status]}

        {!isAllApplicationsCompleted && (
          <div>
            {{submitted: "In the interim, please continue with any remaining forms.",
              approved: "Please continue with the remaining applications to complete your onboarding process.",
              recent: "In the meantime, please continue with the remaining applications to complete your onboarding process.",
            }[status]}
          </div>
        )}
        { status === "approved" ? (
          <div><br/>Thank you,<br/>The ValidPath Team</div>
        ) : (
          <div><br/>Sincerely,<br/>The ValidPath Team</div>
        )}

        {/*Do not render for surveys*/}
        {isFeedbackExist && (
          <div className={"status_description_action"}>
            <Button className={"status_description_action_show-button"} onClick={() => onForceApplicationShow(true)} color="primary">
              View feedback
            </Button>
          </div>
        )}
      </div>
    </div>
  )
};

export default OnboardingSurveyStatusComponent;
