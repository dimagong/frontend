export const loginModel = (spec) => {
  const {
    needs_2fa,
    token,
    tmp_token
  } = spec;

  return {
    needs_2fa,
    token,
    tmp_token,
  }
};
