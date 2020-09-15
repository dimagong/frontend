import Login from "features/auth/login/Login";
// import ResetPassword from "features/auth/ResetPassword";

import {
  loginPath,
  homePath,
} from "constants/paths";

const routes = [
 
  {
    path: loginPath,
    Component: Login,
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
