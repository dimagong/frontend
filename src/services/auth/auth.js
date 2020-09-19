
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => localStorage.getItem('token');

export const isLoggedIn = () => Boolean(getToken());

export const logout = () => {
  localStorage.removeItem('token');
};
