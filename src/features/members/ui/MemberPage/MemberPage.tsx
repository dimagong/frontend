import "./styles.scss";

import OrganizationLogo from "./logo.svg";

import React from "react";
import { Layout } from "antd";
import type { FC } from "react";

import { NmpCol, NmpRow } from "features/nmp-ui";

export const MemberPage: FC = () => {
  const organizationName = "";

  return (
    <Layout className="nmp-member__layout">
      <Layout.Header prefixCls="nmp-member__header">
        <NmpRow>
          <NmpCol span="4">
            <img src={OrganizationLogo} alt={organizationName} />
          </NmpCol>

          <NmpCol span="16">Menu</NmpCol>

          <NmpCol span="4">User information</NmpCol>
        </NmpRow>
      </Layout.Header>

      <Layout.Content>
        <h1>MemberPage</h1>
      </Layout.Content>
    </Layout>
  );
};
