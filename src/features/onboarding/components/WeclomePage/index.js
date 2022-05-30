import React from "react";
import { Button } from "reactstrap";
import { useDispatch } from "react-redux";
import { ChevronDown, ChevronRight } from "react-feather";

import appSlice from "app/slices/appSlice";
import { useOrganizationBrochureQuery } from "api/file/useOrganizationFileQueries";

const { removeUserNotifyRequest } = appSlice.actions;

const WelcomePageComponent = ({ profile, isOnboardingExist }) => {
  const dispatch = useDispatch();

  const brochureQuery = useOrganizationBrochureQuery({
    organizationId: profile.permissions.organization_id,
    organizationType: profile.permissions.organization_type,
  });

  const proceedUserToOnboarding = () => {
    dispatch(removeUserNotifyRequest());
  };

  return (
    <div className={"welcome-onboarding"}>
      <div>
        <h1 className={"welcome-onboarding_title"}>{profile.notify_entity.intro_title}</h1>
      </div>
      <div
        className={"welcome-onboarding_intro-text"}
        dangerouslySetInnerHTML={{ __html: profile.notify_entity.intro_text }}
      />
      <div className={"welcome-onboarding_download-button"}>
        <a
          href={brochureQuery.data.url}
          download={brochureQuery.data.file?.name}
          className={"welcome-onboarding_download-button_button btn btn-secondary"}
        >
          Download the Welcome to {profile.permissions.organization} brochure <ChevronDown />
        </a>
      </div>
      {isOnboardingExist && (
        <div className={"welcome-onboarding_join-button"}>
          <Button className={"welcome-onboarding_join-button_button"} onClick={proceedUserToOnboarding}>
            Let's get started
            <ChevronRight className={"welcome-onboarding_join-button_button_chevron"} size={45} />
          </Button>
        </div>
      )}
    </div>
  );
};

export default WelcomePageComponent;
