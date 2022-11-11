import React from "react";

import { useLoginMutation } from "api/Auth/authQuery";

import LoginForm from "./LoginForm";
import LoginTemplate from "../LoginTemplate";

const Login = () => {
  const login = useLoginMutation();

  const handleLogin = (formData) => {
    login.mutate({
      email: formData.email,
      password: formData.password,
      device_name: "browser",
      remember_me: formData.isRememberMe,
    });
  };

  return (
    <LoginTemplate>
      <LoginForm onLogin={handleLogin} />
    </LoginTemplate>
  );
};

export default Login;
