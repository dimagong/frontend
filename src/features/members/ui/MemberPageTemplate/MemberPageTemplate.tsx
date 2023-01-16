import "./styles.scss";

import React from "react";
import { Layout } from "antd";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import type { FC, ReactNode } from "react";

import { history } from "routes/history";
import appSlice from "app/slices/appSlice";
import { useUserAvatarQuery } from "api/file/useUserAvatarQueries";
import { NmpCol, NmpRow, NmpUserInfo, NpmSpin } from "features/nmp-ui";
import { useProfileQuery } from "features/user/queries/useProfileQuery";
import DeprecatedNmpOrganizationLogo from "components/nmp/DeprecatedNmpOrganizationLogo";

const { logout } = appSlice.actions as any;

export type MemberPageTemplateProps = {
  isLoading?: boolean;
  menu?: ReactNode;
};

export const MemberPageTemplate: FC<MemberPageTemplateProps> = (props) => {
  const { menu, isLoading = false, children } = props;

  const dispatch = useDispatch();
  const profileQuery = useProfileQuery();
  const profile = profileQuery.data!;

  const avatarQuery = useUserAvatarQuery(
    { userId: profile.id, isOnboarding: true },
    { enabled: Boolean(profile.avatar?.id) && !isLoading }
  );

  const onLogout = () => {
    dispatch(logout());
    history.push("/login");
  };

  return (
    <Layout className="nmp-member__layout">
      <Layout.Header prefixCls="nmp-member__header">
        <div className="nmp-member__container">
          <NmpRow>
            <NmpCol span="4">
              <Link to="/">
                <DeprecatedNmpOrganizationLogo
                  fileId={profile.permissions.logo?.id}
                  isOnboarding={true}
                  organizationId={profile.permissions.organization_id}
                  organizationName={profile.permissions.organization}
                  organizationType={profile.permissions.organization_type}
                  className="nmp-member__logo"
                />
              </Link>
            </NmpCol>

            <NmpCol span="16">{menu}</NmpCol>

            <NmpCol span="4">
              <NmpUserInfo
                username={profile.first_name}
                avatarSrc={avatarQuery.data.url}
                organizationName={profile.permissions.organization}
                onLogout={onLogout}
              />
            </NmpCol>
          </NmpRow>
        </div>
      </Layout.Header>

      <Layout prefixCls="nmp-member__container">
        <Layout.Content prefixCls="nmp-member__content">{isLoading ? <NpmSpin size={60} /> : children}</Layout.Content>
      </Layout>
    </Layout>
  );
};
