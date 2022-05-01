export const loginWithJWT = (user) => {
  return {
    type: "LOGIN_WITH_JWT",
    payload: { user: user, loggedType: "jwt" },
  };
};

export const logoutWithJWT = () => {
  return { type: "LOGOUT_WITH_JWT", payload: {} };
};

export const changeRole = (role) => {
  return (dispatch) => dispatch({ type: "CHANGE_ROLE", userRole: role });
};
