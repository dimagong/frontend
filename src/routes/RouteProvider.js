import React from "react";
import { Redirect } from "react-router-dom";

import { ContextLayout } from "utility/context/Layout";
import { homePath, memberPath } from "constants/paths";

const DefaultLayout = ({ isFullLayout, Component }) => {
  return (
    <ContextLayout.Consumer>
      {(context) => {
        const LayoutTag = isFullLayout ? context.fullLayout : context.VerticalLayout;
        return <LayoutTag children={<Component />} />;
      }}
    </ContextLayout.Consumer>
  );
};

const Private = (props) => {
  const { isAuth, redirect, location, Component, isFullLayout, isManager, isMember } = props;

  if (!isAuth) {
    return <Redirect to={{ pathname: redirect, state: { from: location } }} />;
  }

  if (location.pathname !== memberPath && isMember === true) {
    return <Redirect to={{ pathname: memberPath }} />;
  }

  if (location.pathname === memberPath && isMember === false) {
    return <Redirect to={{ pathname: homePath }} />;
  }

  if (location.pathname === memberPath && isMember) {
    return <Component />;
  }

  if (isManager) {
    return <DefaultLayout isFullLayout={isFullLayout} Component={Component} />;
  }

  return null;
};

const Public = (props) => {
  const { isAuth, redirect, location, Component, isFullLayout } = props;

  if (isAuth) {
    return <Redirect to={{ pathname: redirect, state: { from: location } }} />;
  }

  return <DefaultLayout isFullLayout={isFullLayout} Component={Component} />;
};

export const RouteProvider = { Public, Private };
