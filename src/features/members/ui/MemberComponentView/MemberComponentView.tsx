import React from "react";

import { useNotifyIntroductionPageSeeingMutation } from "api/Onboarding/prospectUserQuery";

import MemberDFormView from "../MemberDFormView";
import MemberSurveyView from "../MemberSurveyView";
import { TypeConstants } from "../../data/constants/typeApplication";
import { MemberIntroductionTemplate } from "../MemberIntroductionTemplate";

export const MemberComponentView = (props) => {
  const { profile, applications, activeApplicationId } = props;

  const userId = profile.id as number;
  const username = profile.first_name as string;
  const notifyEntry = profile.notify_entries.length > 0 ? profile.notify_entries[0] : null;
  const organizationName = profile.permissions.organization as string;

  const activeApplication = applications.find(({ id }) => id === activeApplicationId);

  const useRemoveUserNotify = useNotifyIntroductionPageSeeingMutation({ userId, userNotifyEntryId: notifyEntry?.id });

  const onIntroductionStart = () => useRemoveUserNotify.mutate();

  if (notifyEntry) {
    const introduction = notifyEntry.notify;

    return (
      <MemberIntroductionTemplate
        username={username}
        introText={introduction.intro_text}
        introTitle={introduction.intro_title}
        brochureId={introduction.id}
        downloadText={introduction.download_text}
        onStartClick={onIntroductionStart}
        isOnboardingExist={applications.length > 0}
      />
    );
  }

  return (
    <>
      {activeApplication.type === TypeConstants.SURVEY && (
        <MemberSurveyView organization={organizationName} selectedSurveyId={activeApplicationId} />
      )}
      {activeApplication.type === TypeConstants.DFORM && (
        <MemberDFormView
          dformId={activeApplication.id}
          status={activeApplication.status}
          organization={organizationName}
          userFirstName={username}
        />
      )}
    </>
  );
};
