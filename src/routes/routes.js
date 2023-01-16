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
};

const loginRoute = {
  path: loginPath,
  exact: true,
  redirect: homePath,
  isPrivate: false,
  Component: lazy(() => import("../features/auth/login/LoginPage")),
};

const twoFactorAuthRoute = {
  path: twoFactorAuthPath,
  exact: true,
  redirect: homePath,
  isPrivate: false,
  Component: lazy(() => import("features/auth/2FA/2FAPage")),
};

const forgotPasswordRoute = {
  path: forgotPasswordPath,
  exact: true,
  redirect: homePath,
  isPrivate: false,
  Component: lazy(() => import("../features/auth/forgotPassword/ForgotPasswordPage")),
};

const membersRoute = {
  path: memberPath,
  redirect: loginPath,
  isPrivate: true,
  Component: lazy(() => import("features/members/ui/MemberPage").then((m) => ({ ...m, default: m.MemberPage }))),
};

const invitationRoute = {
  path: invitationPath,
  exact: true,
  redirect: loginPath,
  isPrivate: false,
  Component: lazy(() => import("../features/invitation/InvitationPage")),
};

const notFoundRoute = {
  path: "*",
  exact: true,
  isPrivate: false,
  Component: lazy(() => import("components/misc/error/404Page")),
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
