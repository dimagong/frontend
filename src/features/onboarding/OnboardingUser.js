import React, { useEffect } from "react";
import { Spinner } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";
import { selectProfile } from "app/selectors";
import { selectOnboardingSurveys } from "app/selectors/userSelectors";
import { createLoadingSelector } from "app/selectors/loadingSelector";
import { useOrganizationBrochureQuery } from "api/file/useOrganizationFileQueries";
import "./styles.scss";

import _ from "lodash";

import WelcomePageComponent from "./components/WeclomePage";

import OnboardingComponent from "./components/Onboarding";

import appSlice from "app/slices/appSlice";

const { setProfileOnboarding, getAssignedSurveysForOnboardingRequest, removeUserNotifyRequest } = appSlice.actions;

const OnboardingUser = () => {
  const dispatch = useDispatch();
  const profile = useSelector(selectProfile);
  const onboardingSurveys = useSelector(selectOnboardingSurveys);

  const isOnboardingSurveysLoading = useSelector(
    createLoadingSelector([getAssignedSurveysForOnboardingRequest.type], true)
  );

  const proceedUserToOnboarding = () => {
    dispatch(removeUserNotifyRequest({ userId: profile.id, userNotifyEntryId: profile.notify_entries[0]?.id }));
  };

  const brochureQuery = useOrganizationBrochureQuery(
    { introPageId: profile.notify_entries[0]?.notify?.id },
    { enabled: profile.notify_entries.length === 1 }
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

  if (profile.notify_entries.length > 0) {
    return (
      <WelcomePageComponent
        onSubmit={proceedUserToOnboarding}
        isOnboardingExist={!!userApplications.length}
        brochureName={brochureQuery.data.file?.name}
        brochureUrl={brochureQuery.data.url}
        organizationName={profile.permissions.organization}
        introText={profile.notify_entries[0].notify.intro_text}
        introTitle={profile.notify_entries[0].notify.intro_title}
      />
    );
  }

  return <OnboardingComponent userApplications={userApplications} profile={profile} />;
};

export default OnboardingUser;
