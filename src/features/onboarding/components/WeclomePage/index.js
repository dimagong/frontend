import React from "react";
import { Button } from "reactstrap";
import { ChevronDown, ChevronRight } from "react-feather";

import appSlice from "../../../../app/slices/appSlice";

import { useDispatch } from "react-redux";

const { removeUserNotifyRequest } = appSlice.actions;

const WelcomePageComponent = ({ profile, isOnboardingExist }) => {
  const dispatch = useDispatch();

  const fetchFile = async (file) => {
    let response = await fetch(`${process.env.REACT_APP_API_URL}/api/file/${file.id}`, {
      headers: new Headers({
        Authorization: "Bearer " + localStorage.getItem("token"),
      }),
    });
    let data = await response.blob();
    let metadata = {
      type: file.mime_type,
    };

    return new File([data], file.name, metadata);
  };

  const saveBrochure = async (brochure) => {
    const file = await fetchFile(brochure);
    const blob = new Blob([file], { type: "application/pdf" });
    if (window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveBlob(blob, brochure.name);
    } else {
      const elem = window.document.createElement("a");
      elem.href = window.URL.createObjectURL(blob);
      elem.download = brochure.name;
      document.body.appendChild(elem);
      elem.click();
      document.body.removeChild(elem);
    }
  };

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
        <Button
          className={"welcome-onboarding_download-button_button"}
          onClick={() => {
            saveBrochure(profile.notify_entity.brochure);
          }}
        >
          Download the Welcome to {profile.permissions.organization} brochure <ChevronDown />
        </Button>
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
