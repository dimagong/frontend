import "./styles.scss";

import { Layout } from "antd";
import type { FC } from "react";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";

import {
  useMVADFormsQuery,
  useSurveyPassingQuery,
  useMVADFormsCategoriesQuery,
  useMVADFormsCategoriesRegisterQuery,
} from "api/Onboarding/prospectUserQuery";
import appSlice from "app/slices/appSlice";
import { history } from "../../../../history";
import { useUserAvatarQuery } from "api/file/useUserAvatarQueries";
import { NmpCol, NmpRow, NmpUserInfo, NpmSpin } from "features/nmp-ui";
import { useProfileQuery } from "features/user/queries/useProfileQuery";
import DeprecatedNmpOrganizationLogo from "components/nmp/DeprecatedNmpOrganizationLogo";

import { MemberMenu } from "../MemberMenu";
import { MemberComponentView } from "../MemberComponentView";

import { initialAppOnboarding } from "../../utils/findActiveAppOnboarding";
import { collectApplicationsUser } from "../../utils/collectApplicationsUser";

const { logout } = appSlice.actions;

export const MemberPage: FC = () => {
  const dispatch = useDispatch();
  const profileQuery = useProfileQuery();

  const profile = profileQuery.data as any;
  const userId = profile.id as number;
  const avatarId = profile.avatar.id as number;
  const logoId = profile.permissions.logo.id as number;
  const username = profile.first_name as string;
  const organizationId = profile.permissions.organization_id as number;
  const organizationType = profile.permissions.organization_type as string;
  const organizationName = profile.permissions.organization as string;
  const notifyEntry = profile.notify_entries.length > 0 ? profile.notify_entries[0] : null;

  const avatarQuery = useUserAvatarQuery(
    // @ts-ignore
    { userId, fileId: avatarId, isOnboarding: true },
    { enabled: Boolean(avatarId) }
  );

  const dformsQuery = useMVADFormsQuery();
  const surveysQuery = useSurveyPassingQuery();
  const dformsCategoriesQuery = useMVADFormsCategoriesQuery();
  const dformsCategoriesRegisterQuery = useMVADFormsCategoriesRegisterQuery();

  const dforms = dformsQuery.data ?? [];
  const surveys = surveysQuery.data ?? [];
  const dformsCategories = dformsCategoriesQuery.data ?? [];
  const dformsCategoriesRegister = dformsCategoriesRegisterQuery.data ?? [];

  const isDataAble =
    dformsQuery.data &&
    !dformsQuery.isLoading &&
    surveysQuery.data &&
    !surveysQuery.isLoading &&
    dformsCategoriesQuery.data &&
    dformsCategoriesRegisterQuery.data;

  const applications = collectApplicationsUser(dforms, surveys);
  // This shit possible false
  const initialApplication = initialAppOnboarding(profile, isDataAble ? applications : []);

  const [activeApplicationId, setActiveApplicationId] = useState<number>();
  const activeApplication = applications.find(({ id }) => id === activeApplicationId);

  const isApplicationDataAble = activeApplication && isDataAble;

  useEffect(() => {
    if (initialApplication?.id) {
      setActiveApplicationId(initialApplication.id);
    }
  }, [initialApplication?.id]);

  const onLogout = () => {
    // @ts-ignore
    dispatch(logout());
    history.push("/login");
  };

  const onMenuChange = (application) => setActiveApplicationId(application.id);

  return (
    <Layout className="nmp-member__layout">
      <Layout.Header prefixCls="nmp-member__header">
        <div className="nmp-member__container">
          <NmpRow>
            <NmpCol span="4">
              <DeprecatedNmpOrganizationLogo
                fileId={logoId}
                isOnboarding={true}
                organizationId={organizationId}
                organizationName={organizationName}
                organizationType={organizationType}
                className="nmp-member__logo"
              />
            </NmpCol>

            <NmpCol span="16">
              {isApplicationDataAble && !notifyEntry ? (
                <MemberMenu
                  dforms={dforms}
                  surveys={surveys}
                  onboardings={applications}
                  activeOnboarding={activeApplication}
                  dFormsCategories={dformsCategories}
                  dFormsCategoriesRegister={dformsCategoriesRegister}
                  onMenuChange={onMenuChange}
                />
              ) : null}
            </NmpCol>

            <NmpCol span="4">
              <NmpUserInfo
                username={username}
                avatarSrc={avatarQuery.data.url}
                organizationName={organizationName}
                onLogout={onLogout}
              />
            </NmpCol>
          </NmpRow>
        </div>
      </Layout.Header>

      <Layout>
        <Layout.Content prefixCls="nmp-member__content">
          <div className="nmp-member__container">
            {isApplicationDataAble ? (
              <MemberComponentView
                profile={profile}
                applications={applications}
                activeApplicationId={activeApplicationId}
              />
            ) : (
              <NpmSpin size={60} />
            )}
          </div>
        </Layout.Content>
      </Layout>
    </Layout>
  );
};
