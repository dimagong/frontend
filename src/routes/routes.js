import { lazy } from "react";

import {
  loginPath,
  homePath,
  forgotPasswordPath,
  notificationsPath,
  dformsPath,
  workflowsPath,
  invitationPath,
  onboardingProcessPath,
  userProfilePath,
  twoFactorAuthPath,
} from "constants/paths";

const Login = lazy(() => import("features/auth/login/Login"));
const TwoFactorAuthenticator = lazy(() => import("features/auth/2FA/2FA"));
const ForgotPassword = lazy(() => import("features/auth/forgotPassword/ForgotPassword"));
const Notifications = lazy(() => import("features/onboarding/notifications/Notifications"));
const DForm = lazy(() => import("features/onboarding/dForm/DForm"));
const Workflow = lazy(() => import("features/onboarding/workflow/Workflow"));
const MemberPage = lazy(() => import("features/members/ui/MemberPage").then((m) => ({ ...m, default: m.MemberPage })));
const Invitation = lazy(() => import("features/invitation/Invitation"));
const Home = lazy(() => import("features/home/Home"));
const Error404 = lazy(() => import("components/misc/error/404"));
const UserProfile = lazy(() => import("features/user/userEdit/UserEdit"));

const routes = [
  {
    path: userProfilePath,
    Component: UserProfile,
    isPrivate: true,
    redirect: loginPath,
  },
  {
    path: loginPath,
    Component: Login,
    isPrivate: false,
    exact: true,
    redirect: homePath,
    fullLayout: true,
  },
  {
    path: twoFactorAuthPath,
    Component: TwoFactorAuthenticator,
    isPrivate: false,
    exact: true,
    redirect: homePath,
    fullLayout: true,
  },
  {
    path: forgotPasswordPath,
    Component: ForgotPassword,
    isPrivate: false,
    exact: true,
    redirect: homePath,
  },
  {
    path: notificationsPath,
    Component: Notifications,
    isPrivate: true,
    exact: false,
    redirect: loginPath,
  },
  {
    path: dformsPath,
    Component: DForm,
    isPrivate: true,
    exact: false,
    redirect: loginPath,
  },
  {
    path: workflowsPath,
    Component: Workflow,
    isPrivate: true,
    exact: false,
    redirect: loginPath,
  },
  {
    path: invitationPath,
    Component: Invitation,
    isPrivate: false,
    exact: true,
    redirect: loginPath,
    fullLayout: true,
  },
  {
    path: homePath,
    Component: Home,
    isPrivate: true,
    redirect: loginPath,
    exact: true,
  },
  {
    path: onboardingProcessPath,
    Component: MemberPage,
    isPrivate: true,
    redirect: loginPath,
    exact: true,
  },
  {
    path: "*",
    Component: Error404,
    isPrivate: false,
    exact: true,
    fullLayout: true,
  },
];

export default routes;
