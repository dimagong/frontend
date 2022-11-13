import "./styles.scss";

import React from "react";
import type { FC } from "react";

import { NmpButton, NmpCard } from "features/nmp-ui";

import Submit from "../icons/Submit.svg";
import Reviewed from "../icons/Reviewed.svg";

type Props = {
  isReviewed?: boolean;
  organization?: string;
  onShowDForm?: (v: boolean) => void;
};

export const MemberSubmittedStatusView: FC<Props> = ({ organization, isReviewed = false, onShowDForm }) => {
  const handleShowDForm = () => {
    if (onShowDForm) {
      onShowDForm(true);
    }
  };

  return (
    <div className="submitted-dform">
      <NmpCard>
        <div className="card-submitted">
          <div className="card-submitted_content">
            <div className="cs-title">{isReviewed ? "Success!" : "Submitted"}</div>

            {isReviewed ? (
              <div className="cs-content">
                <div>Thank you.</div>
                <div>Your application review was successful!</div>
                <div>What happens next?</div>
                <div>Please continue with the remaining applications to complete your onboarding process.</div>
                <div>We will be in touch with you shortly with next steps, thank you for your patience.</div>
              </div>
            ) : (
              <div className="cs-content">
                <div>Thank you.</div>
                <div>Your information has been submitted.</div>
                <div>We will review your application and get back shortly.</div>
                <div>
                  Sincerely, <br />
                  The {organization} Team
                </div>
              </div>
            )}

            {isReviewed ? null : (
              <div className="cs-button">
                <NmpButton onClick={handleShowDForm} type={"nmp-primary"}>
                  <span>View application</span>
                  <i className="arrow right"></i>
                </NmpButton>
              </div>
            )}
          </div>
          <div className="card-submitted_img">
            <img className="cs-img" src={isReviewed ? Reviewed : Submit} alt="" />
            <div className="cs-figure"></div>
          </div>
        </div>
      </NmpCard>
    </div>
  );
};
