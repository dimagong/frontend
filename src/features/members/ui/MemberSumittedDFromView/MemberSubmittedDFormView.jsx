import "./styles.scss";

import React from "react";

import { NpmButton, NpmCard } from "features/nmp-ui";
import Submit from "../icons/Submit.svg";

const cardStyle = {
  maxHeight: "600px",
  maxWidth: "1000px",
  width: "85vw",
};

export const MemberSubmittedDFormView = ({ organization, onShowDForm }) => {
  const handleShowDForm = () => {
    onShowDForm(true);
  };
  return (
    <div className="submitted-dform">
      <NpmCard style={cardStyle}>
        <div className="card-submitted">
          <div className="card-submitted_content">
            <div className="cs-title">Submitted</div>
            <div className="cs-content">
              <div>Thank you.</div>
              <div>Your information has been submitted.</div>
              <div>We will review your application and get back shortly.</div>
              <div>
                Sincerely, <br />
                The {organization} Team
              </div>
            </div>
            <div className="cs-button">
              <NpmButton onClick={() => handleShowDForm()}>
                <span>View application</span>
                <i className="arrow right"></i>
              </NpmButton>
            </div>
          </div>
          <div className="card-submitted_img">
            <img className="cs-img" src={Submit} alt="submit" />
            <div className="cs-figure"></div>
          </div>
        </div>
      </NpmCard>
    </div>
  );
};
