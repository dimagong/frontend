import React from "react";
import { Spinner } from "reactstrap";
import { useSelector } from "react-redux";
// import { selectProfile } from "app/selectors";
import { selectOnboardingSurveys } from "app/selectors/userSelectors";
// import { createLoadingSelector } from "app/selectors/loadingSelector";
import { useOrganizationBrochureQuery } from "api/file/useOrganizationFileQueries";
import "./styles.scss";

import _ from "lodash";

import WelcomePageComponent from "./components/WeclomePage";

import OnboardingComponent from "./components/Onboarding";

import { initialAppOnboarding } from "./../../features/onboarding/utils/findActiveAppOnboarding";

//import appSlice from "app/slices/appSlice";
//const { setProfileOnboarding, getAssignedSurveysForOnboardingRequest, removeUserNotifyRequest } = appSlice.actions;

import {
  useProspectUserProfileQuery,
  useSurveyPassingQuery,
  useDFormsListQuery,
  useProspectRemoveUserNotifyMutation,
} from "api/Onboarding/prospectUserQuery";

import { collectApplicationsUser } from "./utils/collectApplicationsUser";

//query
const useCallCollectQuery = () => {
  const userProspectProfile = useProspectUserProfileQuery();
  const userSurveyPassing = useSurveyPassingQuery();
  const useDForms = useDFormsListQuery();
  return { userProspectProfile, userSurveyPassing, useDForms };
};

const OnboardingUser = () => {
  const { userProspectProfile, userSurveyPassing, useDForms } = useCallCollectQuery();

  const profile = userProspectProfile.data;
  const onboardingSurveys = useSelector(selectOnboardingSurveys);

  const dFormsList = useDForms.data;
  //const onboardingApps = profile?.onboardings ?? [];

  const useRemoveUserNotify = useProspectRemoveUserNotifyMutation(
    { userId: profile?.id, userNotifyEntryId: profile?.notify_entries[0]?.id },
    {}
  );
  const proceedUserToOnboarding = () => {
    useRemoveUserNotify.mutate();
  };

  const brochureQuery = useOrganizationBrochureQuery(
    { introPageId: profile?.notify_entries[0]?.notify?.id },
    { enabled: profile?.notify_entries.length === 1 }
  );

  let userApplications = collectApplicationsUser(dFormsList ?? [], onboardingSurveys ?? []);

  const initialOnboarding = initialAppOnboarding(profile, userApplications);

  return userSurveyPassing.isLoading || useDForms.isLoading ? (
    <div className="d-flex justify-content-center pt-5">
      <Spinner color="primary" size={"70"} />
    </div>
  ) : profile?.notify_entries.length ? (
    <WelcomePageComponent
      onSubmit={proceedUserToOnboarding}
      isOnboardingExist={!!userApplications.length}
      brochureName={brochureQuery.data.file?.name}
      brochureUrl={brochureQuery.data.url}
      downloadText={profile?.notify_entries[0].notify.download_text}
      organizationName={profile?.permissions.organization}
      introText={profile?.notify_entries[0].notify.intro_text}
      introTitle={profile?.notify_entries[0].notify.intro_title}
    />
  ) : (
    <OnboardingComponent userApplications={userApplications} profile={profile} initialOnboarding={initialOnboarding} />
  );
};

export default OnboardingUser;
