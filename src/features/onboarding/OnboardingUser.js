import "./styles.scss";

import React from "react";
import { useQueryClient } from "react-query";
import { Spinner } from "reactstrap";

import {
  useProspectUserProfileQuery,
  useSurveyPassingQuery,
  useDFormsQuery,
  useNotifyIntroductionPageSeeingMutation,
} from "api/Onboarding/prospectUserQuery";
import { useOrganizationBrochureQuery } from "api/file/useOrganizationFileQueries";
import { initialAppOnboarding } from "features/onboarding/utils/findActiveAppOnboarding";
import MemberComponentView from "./../members/ui/MemberComponentView";
import IntroPageView from "./../members/ui/IntroPageView";

import { collectApplicationsUser } from "./utils/collectApplicationsUser";
import { MVAProfileQueryKeys } from "../../api/Onboarding/prospectUserQuery";

const useCallCollectQuery = () => {
  const userProspectProfile = useProspectUserProfileQuery({ staleTime: Number.Infinity });
  const userSurveyPassing = useSurveyPassingQuery({ staleTime: 600_000 /* 10min */ });
  const useDForms = useDFormsQuery({ staleTime: 600_000 /* 10min */ });
  return { userProspectProfile, userSurveyPassing, useDForms };
};

const OnboardingUser = () => {
  const { userProspectProfile, userSurveyPassing, useDForms } = useCallCollectQuery();
  const queryClient = useQueryClient();

  const profile = userProspectProfile.data;
  const onboardingSurveys = userSurveyPassing.data;
  const dForms = useDForms.data;

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

  const userApplications = collectApplicationsUser(dForms ?? [], onboardingSurveys ?? []);

  const initialOnboarding = initialAppOnboarding(profile, userApplications);

  return userSurveyPassing.isLoading || useDForms.isLoading ? (
    <div className="d-flex justify-content-center pt-5">
      <Spinner color="primary" size={"70"} />
    </div>
  ) : profile?.notify_entries.length ? (
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
  ) : (
    <MemberComponentView
      userApplications={userApplications}
      profile={profile}
      initialOnboarding={initialOnboarding}
      dForms={dForms}
      surveys={onboardingSurveys}
    />
  );
};

export default OnboardingUser;
