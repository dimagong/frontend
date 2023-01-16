import React from "react";
import type { FC } from "react";
import { useParams } from "react-router-dom";

import { NmpCol, NmpRow, NpmSpin } from "features/nmp-ui";
import { useSurveyByIdQuery } from "api/Onboarding/prospectUserQuery";
import { useProfileQuery } from "features/user/queries/useProfileQuery";

import { MemberSurveyView } from "../MemberSurveyView";

export const MemberSurveyPage: FC = () => {
  const { surveyId } = useParams<{ surveyId: string }>();
  const profileQuery = useProfileQuery();
  const profile = profileQuery.data!;

  const surveyQuery = useSurveyByIdQuery({ id: surveyId });

  if (surveyQuery.isError) {
    const status = (surveyQuery.error as any)?.status ?? 0;

    return (
      <NmpRow justify="center" style={{ padding: "2rem 0" }}>
        <NmpCol>
          <h2>{status === 404 ? `There is no survey with id "${surveyId}".` : "Something went wrong."}</h2>
        </NmpCol>
      </NmpRow>
    );
  }

  if (!surveyQuery.data) {
    return <NpmSpin size={60} />;
  }

  return <MemberSurveyView organization={profile.permissions.organization} survey={surveyQuery.data} />;
};
