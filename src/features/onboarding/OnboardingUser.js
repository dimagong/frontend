import "./styles.scss";

import React from "react";
import { Spinner } from "reactstrap";

import {
  useMVADFormsQuery,
  useSurveyPassingQuery,
  useProspectUserProfileQuery,
  useNotifyIntroductionPageSeeingMutation,
} from "api/Onboarding/prospectUserQuery";
import { useOrganizationBrochureQuery } from "api/file/useOrganizationFileQueries";
import { initialAppOnboarding } from "features/onboarding/utils/findActiveAppOnboarding";

import WelcomePageComponent from "./components/WeclomePage";
import OnboardingComponent from "./components/Onboarding";
import { collectApplicationsUser } from "./utils/collectApplicationsUser";

const useCallCollectQuery = () => {
  const userProspectProfile = useProspectUserProfileQuery({ staleTime: Infinity });
  const userSurveyPassing = useSurveyPassingQuery();
  const useDForms = useMVADFormsQuery();
  return { userProspectProfile, userSurveyPassing, useDForms };
};

const OnboardingUser = () => {
  const { userProspectProfile, userSurveyPassing, useDForms } = useCallCollectQuery();

  const profile = userProspectProfile.data;
  const onboardingSurveys = userSurveyPassing.data;
  const dForms = useDForms.data;

  const useRemoveUserNotify = useNotifyIntroductionPageSeeingMutation({
    userId: profile?.id,
    userNotifyEntryId: profile?.notify_entries[0]?.id,
  });

  const proceedUserToOnboarding = () => {
    useRemoveUserNotify.mutate();
  };

  const brochureQuery = useOrganizationBrochureQuery(
    { introPageId: profile?.notify_entries[0]?.notify?.id },
    {
      enabled: profile?.notify_entries.length === 1,
    }
  );

  const userApplications = collectApplicationsUser(dForms ?? [], onboardingSurveys ?? []);

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
