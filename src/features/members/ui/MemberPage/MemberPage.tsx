import React from "react";
import type { FC } from "react";
import { Switch, Redirect, Route, useRouteMatch } from "react-router-dom";

import {
  useMVADFormsQuery,
  useSurveyPassingQuery,
  useMVADFormsCategoriesQuery,
  useMVADFormsCategoriesRegisterQuery,
  useNotifyIntroductionPageSeeingMutation,
} from "api/Onboarding/prospectUserQuery";
import { NmpCol, NmpRow } from "features/nmp-ui";
import { useProfileQuery } from "features/user/queries/useProfileQuery";

import { MemberMenu } from "../MemberMenu";
import { MemberFormPage } from "../MemberFormPage";
import { MemberSurveyPage } from "../MemberSurveyPage";
import { MemberPageTemplate } from "../MemberPageTemplate";
import { collectApplicationsUser } from "../../utils/collectApplicationsUser";
import { MemberIntroductionTemplate } from "../MemberIntroductionTemplate";

export const MemberPage: FC = () => {
  const { path } = useRouteMatch();
  const profileQuery = useProfileQuery();
  const profile = profileQuery.data!;

  const dformsQuery = useMVADFormsQuery();
  const surveysQuery = useSurveyPassingQuery();
  const dformsCategoriesQuery = useMVADFormsCategoriesQuery();
  const dformsCategoriesRegisterQuery = useMVADFormsCategoriesRegisterQuery();

  const isLoaded =
    dformsQuery.data &&
    !dformsQuery.isLoading &&
    surveysQuery.data &&
    !surveysQuery.isLoading &&
    dformsCategoriesQuery.data &&
    dformsCategoriesRegisterQuery.data;

  const dforms = dformsQuery.data ?? [];
  const surveys = surveysQuery.data ?? [];
  const dformsCategories = dformsCategoriesQuery.data ?? [];
  const dformsCategoriesRegister = dformsCategoriesRegisterQuery.data ?? [];
  const applications = collectApplicationsUser(dforms, surveys);

  const passIntroduction = useNotifyIntroductionPageSeeingMutation({
    userId: profile.id,
    userNotifyEntryId: profile.notify_entries.length > 0 ? profile.notify_entries[0].id : null,
  });

  const onIntroductionStart = () => passIntroduction.mutate();

  const isThereIntroduction = profile.notify_entries.length > 0;

  if (!isLoaded) {
    return <MemberPageTemplate isLoading />;
  }

  if (isThereIntroduction) {
    const { id, intro_text, intro_title, download_text } = profile.notify_entries[0].notify;
    return (
      <MemberPageTemplate>
        <MemberIntroductionTemplate
          username={profile.first_name}
          introText={intro_text}
          introTitle={intro_title}
          brochureId={id}
          downloadText={download_text}
          onStartClick={onIntroductionStart}
          isOnboardingExist={applications.length > 0}
        />
      </MemberPageTemplate>
    );
  }

  return (
    <MemberPageTemplate
      menu={
        <MemberMenu
          surveys={surveys}
          dFormsCategories={dformsCategories}
          dFormsCategoriesRegister={dformsCategoriesRegister}
        />
      }
    >
      <Switch>
        <Route exact path={path}>
          <NmpRow justify="center">
            <NmpCol>
              <h2>Dashboard</h2>
            </NmpCol>
          </NmpRow>
        </Route>

        <Route exact path={`${path}/form`}>
          <Redirect to={path} />
        </Route>

        <Route path={`${path}/form/:formId`} component={MemberFormPage} />

        <Route exact path={`${path}/survey`}>
          <Redirect to={path} />
        </Route>

        <Route path={`${path}/survey/:surveyId`} component={MemberSurveyPage} />
      </Switch>
    </MemberPageTemplate>
  );
};
