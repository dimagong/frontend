import {  lazy } from "react"
// import Login from "features/auth/login/Login";
// import ResetPassword from "features/auth/ResetPassword";
import {
  loginPath,
  homePath,
  forgotPasswordPath,
  notificationsPath,
} from "constants/paths";

const Login = lazy(() => import("features/auth/login/Login"));
const ForgotPassword = lazy(() => import("features/auth/forgotPassword/ForgotPassword"));
const Notifications = lazy(() => import("features/onboarding/notifications/Notifications"));

const routes = [
 
  {
    path: loginPath,
    Component: Login,
    isPrivate: false,
    exact: true,
    redirect: notificationsPath,
    fullLayout: true
  },
  {
    path: forgotPasswordPath,
    Component: ForgotPassword,
    isPrivate: false,
    exact: true,
    redirect: notificationsPath,
  },
  {
    path: notificationsPath,
    Component: Notifications,
    isPrivate: true,
    exact: false,
    redirect: loginPath,
  },
  // {
  //   path: uploadVideoPath,
  //   Component: UploadVideo,
  //   isPrivate: true,
  //   exact: true,
  //   redirect: signInPath,
  // },
];

export default routes;
