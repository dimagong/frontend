import { loginModel } from "./authModel";

const login = (rawData) => {

  const {
    token,
    needs_2fa,
    tmp_token
  } = rawData;

  const loginData = loginModel({
    token,
    needs_2fa,
    tmp_token,
  });

  return loginData;
};

const parseAuthData = (rawData) => {
  return login(rawData)
};

export const authDTO = {
  parse: (rawData) => {
    console.log(rawData);
    return rawData ? parseAuthData(rawData) : null;
  },
};
