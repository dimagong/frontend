import "./styles.scss";

import React from "react";
import { useQueryClient } from "react-query";
import { Spinner } from "reactstrap";

import {
  useMVADFormsQuery,
  useSurveyPassingQuery,
  useProspectUserProfileQuery,
  useNotifyIntroductionPageSeeingMutation,
} from "api/Onboarding/prospectUserQuery";
import { useOrganizationBrochureQuery } from "api/file/useOrganizationFileQueries";
import { initialAppOnboarding } from "features/onboarding/utils/findActiveAppOnboarding";
import MemberComponentView from "./../members/ui/MemberComponentView";
import IntroPageView from "./../members/ui/IntroPageView";

import { collectApplicationsUser } from "./utils/collectApplicationsUser";
import { MVAProfileQueryKeys } from "../../api/Onboarding/prospectUserQuery";

const useCallCollectQuery = () => {
  const userProspectProfile = useProspectUserProfileQuery();
  const userSurveyPassing = useSurveyPassingQuery();
  const useDForms = useMVADFormsQuery();
  return { userProspectProfile, userSurveyPassing, useDForms };
};

const OnboardingUser = () => {
  const { userProspectProfile, userSurveyPassing, useDForms } = useCallCollectQuery();
  const queryClient = useQueryClient();

  const dForms = useDForms.data;
  const profile = userProspectProfile.data;
  const onboardingSurveys = userSurveyPassing.data;

  const useRemoveUserNotify = useNotifyIntroductionPageSeeingMutation({
    userId: profile?.id,
    userNotifyEntryId: profile?.notify_entries[0]?.id,
  });

  const proceedUserToOnboarding = () => {
    useRemoveUserNotify.mutate();
    queryClient.invalidateQueries(MVAProfileQueryKeys.all());
  };

  const brochureQuery = useOrganizationBrochureQuery(
    { introPageId: profile?.notify_entries[0]?.notify?.id },
    {
      enabled: profile?.notify_entries.length === 1,
    }
  );

  if (userSurveyPassing.isLoading || useDForms.isLoading || userProspectProfile.isLoading) {
    return (
      <div className="d-flex justify-content-center pt-5">
        <Spinner color="primary" size={"70"} />
      </div>
    );
  }

  const userApplications = collectApplicationsUser(dForms ?? [], onboardingSurveys ?? []);
  const initialOnboarding = initialAppOnboarding(profile, userApplications);

  if (profile?.notify_entries.length > 0) {
    return (
      <IntroPageView
        userName={profile?.first_name}
        organizationName={profile?.permissions.organization}
        redirectToOnboarding={proceedUserToOnboarding}
        brochureUrl={brochureQuery.data.url}
        brochureName={brochureQuery.data.file?.name}
        isOnboardingExist={!!userApplications.length}
        downloadText={profile?.notify_entries[0].notify.download_text}
        introText={profile?.notify_entries[0].notify.intro_text}
        introTitle={profile?.notify_entries[0].notify.intro_title}
      />
    );
  }

  return (
    <MemberComponentView
      dForms={dForms}
      profile={profile}
      surveys={onboardingSurveys}
      userApplications={userApplications}
      initialOnboarding={initialOnboarding}
    />
  );
};

export default OnboardingUser;
