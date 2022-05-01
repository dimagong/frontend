import React, { useEffect } from "react";
import { Spinner } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { selectProfile } from "app/selectors";
import { selectOnboardingSurveys } from "app/selectors/userSelectors";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import "./styles.scss";

import _ from "lodash";

import WelcomePageComponent from "./components/WeclomePage";

import OnboardingComponent from "./components/Onboarding";

import appSlice from "app/slices/appSlice";

const { setProfileOnboarding, getAssignedSurveysForOnboardingRequest } = appSlice.actions;

const OnboardingUser = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const onboardingSurveys = useSelector(selectOnboardingSurveys);

  const isOnboardingSurveysLoading = useSelector(
    createLoadingSelector([getAssignedSurveysForOnboardingRequest.type], true)
  );

  let userApplications = [];

  userApplications = [...(profile?.onboardings || []), ...(onboardingSurveys || [])];

  if (userApplications.length) {
    // Onboardings and surveys may have Id collisions, we add tabId property to prevent bugs
    userApplications = userApplications.map((application) => {
      return {
        ...application,
        tabId: `${application.id} ${application.d_form ? "onboarding" : "survey"}`,
      };
    });

    userApplications = _.sortBy(userApplications, (application) => {
      return application.order;
    });
  }

  useEffect(() => {
    dispatch(getAssignedSurveysForOnboardingRequest());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (profile && !profile.onboarding?.id) {
      let activeOnboarding = userApplications.find((onboarding) => {
        if (onboarding.d_form) {
          return onboarding.d_form.status === "in-progress" || onboarding.d_form.status === "unsubmitted";
        } else {
          return !onboarding.finished_at;
        }
      });

      if (!activeOnboarding) {
        activeOnboarding = userApplications[0];
      }

      dispatch(setProfileOnboarding(activeOnboarding));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile, isOnboardingSurveysLoading]);

  if (isOnboardingSurveysLoading) {
    return (
      <div className="d-flex justify-content-center pt-5">
        <Spinner color="primary" size={70} />
      </div>
    );
  }

  if (profile.notify && profile.notify_entity) {
    return <WelcomePageComponent profile={profile} isOnboardingExist={!!userApplications.length} />;
  }

  return <OnboardingComponent userApplications={userApplications} profile={profile} />;
};

export default OnboardingUser;
