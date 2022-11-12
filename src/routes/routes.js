import { lazy } from "react";

import {
  homePath,
  loginPath,
  memberPath,
  invitationPath,
  twoFactorAuthPath,
  forgotPasswordPath,
} from "constants/paths";

const homeRoute = {
  path: homePath,
  exact: true,
  redirect: loginPath,
  isPrivate: true,
  Component: lazy(() => import("../features/home/HomePage")),
  isFullLayout: false,
};

const loginRoute = {
  path: loginPath,
  exact: true,
  redirect: homePath,
  isPrivate: false,
  Component: lazy(() => import("../features/auth/login/LoginPage")),
  isFullLayout: true,
};

const twoFactorAuthRoute = {
  path: twoFactorAuthPath,
  exact: true,
  redirect: homePath,
  isPrivate: false,
  Component: lazy(() => import("features/auth/2FA/2FAPage")),
  isFullLayout: true,
};

const forgotPasswordRoute = {
  path: forgotPasswordPath,
  exact: true,
  redirect: homePath,
  isPrivate: false,
  Component: lazy(() => import("../features/auth/forgotPassword/ForgotPasswordPage")),
  isFullLayout: true,
};

const membersRoute = {
  path: memberPath,
  exact: true,
  redirect: loginPath,
  isPrivate: true,
  Component: lazy(() => import("features/members/ui/MemberPage").then((m) => ({ ...m, default: m.MemberPage }))),
  isFullLayout: false,
};

const invitationRoute = {
  path: invitationPath,
  exact: true,
  redirect: loginPath,
  isPrivate: false,
  Component: lazy(() => import("../features/invitation/InvitationPage")),
  isFullLayout: true,
};

const notFoundRoute = {
  path: "*",
  exact: true,
  isPrivate: false,
  Component: lazy(() => import("components/misc/error/404Page")),
  isFullLayout: true,
};

const routes = [
  homeRoute,
  membersRoute,
  loginRoute,
  twoFactorAuthRoute,
  forgotPasswordRoute,
  invitationRoute,
  notFoundRoute,
];

export default routes;
