import "../../../old-styles";

import React from "react";

import { Layout } from "utility/context/Layout";
import { useLoginMutation } from "api/Auth/authQuery";

import LoginForm from "./LoginForm";
import LoginTemplate from "../loginTemplate/LoginTemplate";

const LoginPage = () => {
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
    <Layout type="full">
      <LoginTemplate>
        <LoginForm onLogin={handleLogin} />
      </LoginTemplate>
    </Layout>
  );
};

export default LoginPage;
