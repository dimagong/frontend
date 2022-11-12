import React from "react";
import { Redirect } from "react-router-dom";

import { homePath, memberPath } from "constants/paths";

const Private = (props) => {
  const { isAuth, redirect, location, Component, isManager, isMember } = props;

  if (!isAuth) {
    return <Redirect to={{ pathname: redirect, state: { from: location } }} />;
  }

  if (location.pathname !== memberPath && isMember) {
    return <Redirect to={{ pathname: memberPath }} />;
  }

  if (location.pathname === memberPath && isManager) {
    return <Redirect to={{ pathname: homePath }} />;
  }

  if (isManager || isMember) {
    return <Component />;
  }

  return null;
};

const Public = (props) => {
  const { isAuth, redirect, location, Component } = props;

  if (isAuth) {
    return <Redirect to={{ pathname: redirect, state: { from: location } }} />;
  }

  return <Component />;
};

export const RouteProvider = { Public, Private };
