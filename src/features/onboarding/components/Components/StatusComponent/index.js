import React from "react";
import { Button } from "reactstrap";

import Approved from "../../../approved.svg";
import Submitted from "../../../submitted.svg";
import Review from "../../../onReview.svg";

const statusImages = {
  approved: { img: Approved, alt: "form approved" },
  submitted: { img: Review, alt: "form submitted" },
  recent: { img: Submitted, alt: "form recently submitted" },
};

const StatusComponent = ({ application, status, onForceApplicationShow, isAllApplicationsCompleted }) => {
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
                <h1>Under Review</h1>
                <div>You have successfully submitted your information, and it is currently under review.</div>
                <div>
                  <span className="font-weight-bold">What happens next?</span>
                  <br />
                  After our review, we will be in touch with next steps.
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

        {isAllApplicationsCompleted && (
          <div>
            {
              {
                submitted: "In the meantime, please continue with the remaining applications",
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
        {application.d_form && (
          <div className={"status_description_action"}>
            <Button
              className={"status_description_action_show-button"}
              onClick={() => onForceApplicationShow(application.id)}
              color="primary"
            >
              View application
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatusComponent;
