import {  lazy } from "react"
// import Login from "features/auth/login/Login";
// import ResetPassword from "features/auth/ResetPassword";
import {
  loginPath,
  homePath,
  forgotPasswordPath
} from "constants/paths";

const Login = lazy(() => import("features/auth/login/Login"));
const ForgotPassword = lazy(() => import("features/auth/forgotPassword/ForgotPassword"));

const routes = [
 
  {
    path: loginPath,
    Component: Login,
    isPrivate: false,
    exact: true,
    redirect: homePath,
  },
  {
    path: forgotPasswordPath,
    Component: ForgotPassword,
    isPrivate: false,
    exact: true,
    redirect: homePath,
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
