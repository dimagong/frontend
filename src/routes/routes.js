import React from 'react';

import {  lazy } from "react"
// import Login from "features/auth/login/Login";
// import ResetPassword from "features/auth/ResetPassword";
import {
  loginPath,
  homePath,
  forgotPasswordPath,
  notificationsPath,
  dformsPath,
  workflowsPath,
  userManagmentPath,
  invitationPath,
  onboardingProcessPath,
  masterSchemaPath,
  userProfilePath,
  surveysDesignerExplore,
  surveysDesignerCreate,
} from "constants/paths";

const Login = lazy(() => import("features/auth/login/Login"));
const ForgotPassword = lazy(() => import("features/auth/forgotPassword/ForgotPassword"));
const Notifications = lazy(() => import("features/onboarding/notifications/Notifications"));
const DForm = lazy(() => import("features/onboarding/dForm/DForm"));
const Workflow = lazy(() => import("features/onboarding/workflow/Workflow"));
const OnboardingUser = lazy(() => import("features/onboarding/OnboardingUser"));
const UserManagment = lazy(() => import("features/user-managment/UserManagment"));
const Invitation = lazy(() => import("features/invitation/Invitation"));
const Home = lazy(() => import("features/home/Home"));
const Error404 = lazy(() => import("components/misc/error/404"));
const MasterSchema = lazy(() => import("views/pages/master-schema/index"));
// const SurveysDesigner = lazy(() => import("features/Surveys/SurveysDesigner/index"));
const UserProfile = lazy(() => import("features/user-managment/userEdit/UserEdit"));

const routes = [
  // {
  //   path: surveysDesignerExplore,
  //   Component: SurveysDesigner,
  //   isPrivate: true,
  //   redirect: loginPath,
  // },
  // {
  //   path: surveysDesignerCreate,
  //   Component: () => <SurveysDesigner isCreate />,
  //   isPrivate: true,
  //   redirect: loginPath,
  // },
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
    fullLayout: true
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
  // {
  //   path: userManagmentPath,
  //   Component: UserManagment,
  //   isPrivate: true,
  //   exact: true,
  //   redirect: loginPath,
  // },
  {
    path: invitationPath,
    Component: Invitation,
    isPrivate: false,
    exact: true,
    redirect: loginPath,
    fullLayout: true
  },
  {
    path: homePath,
    Component: Home,
    isPrivate: true,
    redirect: loginPath,
    exact: true,
  },
  {
    path: masterSchemaPath,
    Component: MasterSchema,
    isPrivate: true,
    redirect: loginPath,
    exact: true,
  },
  {
    path: onboardingProcessPath,
    Component: OnboardingUser,
    isPrivate: true,
    redirect: loginPath,
    exact: true,
  },
  {
    path: "*",
    Component: Error404,
    isPrivate: false,
    exact: true,
    fullLayout: true
  },
];

export default routes;
