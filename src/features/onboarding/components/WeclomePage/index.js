import React from "react";
import { Button } from "reactstrap";
import { ChevronDown, ChevronRight } from "react-feather";
import "./styles.scss";

const WelcomePageComponent = ({
  isOnboardingExist,
  brochureName,
  brochureUrl,
  onSubmit,
  organizationName,
  introText,
  introTitle,
  preview,
}) => {
  if (preview && (!introText || !introTitle)) {
    return <div>Please enter all intro page info to see preview</div>;
  }

  return (
    <div className={"welcome-onboarding"}>
      <div>
        <h1 className={"welcome-onboarding_title"}>{introTitle}</h1>
      </div>
      <div className={"welcome-onboarding_intro-text"} dangerouslySetInnerHTML={{ __html: introText }} />
      <div className={"welcome-onboarding_download-button"}>
        <a
          href={brochureUrl}
          download={brochureName}
          className={"welcome-onboarding_download-button_button btn btn-secondary"}
        >
          Download the Welcome to {organizationName} brochure <ChevronDown />
        </a>
      </div>
      {isOnboardingExist && (
        <div className={"welcome-onboarding_join-button"}>
          <Button className={"welcome-onboarding_join-button_button"} onClick={onSubmit}>
            Let's get started
            <ChevronRight className={"welcome-onboarding_join-button_button_chevron"} size={45} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default WelcomePageComponent;
