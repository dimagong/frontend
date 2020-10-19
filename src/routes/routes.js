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
  processPath,
  masterSchemaPath,
} from "constants/paths";

const Login = lazy(() => import("features/auth/login/Login"));
const ForgotPassword = lazy(() => import("features/auth/forgotPassword/ForgotPassword"));
const Notifications = lazy(() => import("features/onboarding/notifications/Notifications"));
const DForm = lazy(() => import("features/onboarding/dForm/DForm"));
const Workflow = lazy(() => import("features/onboarding/workflow/Workflow"));
const UserManagment = lazy(() => import("features/user-managment/UserManagment"));
const Invitation = lazy(() => import("features/invitation/Invitation"));
const Home = lazy(() => import("features/home/Home"));
const Error404 = lazy(() => import("components/misc/error/404"));
const MasterSchema = lazy(() => import("components/misc/ComingSoon"));

const routes = [
 
  {
    path: loginPath,
    Component: Login,
    isPrivate: false,
    exact: true,
    redirect: userManagmentPath,
    fullLayout: true
  },
  {
    path: forgotPasswordPath,
    Component: ForgotPassword,
    isPrivate: false,
    exact: true,
    redirect: userManagmentPath,
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
    path: userManagmentPath,
    Component: UserManagment,
    isPrivate: true,
    exact: true,
    redirect: loginPath,
  },
  {
    path: invitationPath,
    Component: Invitation,
    isPrivate: true,
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
    path: "*",
    Component: Error404,
    isPrivate: false,
    exact: true,
    fullLayout: true
  },
];

export default routes;
