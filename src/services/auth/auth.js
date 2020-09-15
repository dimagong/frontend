
export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const getToken = () => JSON.parse(localStorage.getItem('token'));

export const isLoggedIn = () => Boolean(getToken());

export const logout = () => {
  localStorage.removeItem('token');
};
