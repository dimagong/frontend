import "./styles.scss";

import React from "react";
import moment from "moment";

import NpmCard from "../../../nmp-ui/NpmCard";
import Envelop from "./../icons/Envelop.svg";

const MemberCardSubmitted = ({ data, organization, surveyName }) => {
  return (
    <>
      <NpmCard>
        <div className="card-submitted">
          <div className="card-submitted_content">
            <div className="cs-header">
              <div className="cs-header_title">{surveyName}</div>
              <div className="cs-header_data">{moment(data).format("DD.MM.YYYY")}</div>
            </div>
            <div className="cs-title">Thank you</div>
            <div className="cs-content">
              <div>You have successfully submitted this questionnaire, and it is currently under review.</div>
              <div>
                What happens next? <br /> You will receive a notification once it has been graded with any relevant
                feedback if necessary.
              </div>
              <div>In the interim, please continue with any remaining forms.</div>
              <div>
                Sincerely, <br />
                The {organization} Team
              </div>
            </div>
          </div>
          <div className="card-submitted_img">
            <img className="cs-img" src={Envelop} alt="envelop" />
            <div className="cs-figure"></div>
          </div>
        </div>
      </NpmCard>
    </>
  );
};

export default MemberCardSubmitted;
