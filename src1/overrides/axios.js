import axios from "axios";


const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // responseType: "json"
});


const token = localStorage.getItem('token');

if (token) {
  instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

instance.defaults.headers.common['Access-Control-Allow-Origin'] = `*`;
instance.defaults.headers.common['Content-Type'] = `application/json`;
instance.defaults.withCredentials = true


instance.interceptors.request.use(function (config) {
  return config;
}, function (error) {
  return Promise.reject(error);
});

instance.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  console.dir(error);
  if ('error' in error.response.data &&
    error.response.data.error.message === 'Unauthenticated.' &&
    error.response.data.error.status === 401 &&
    error.config.url.indexOf('login') === -1) {
      localStorage.removeItem('token');
      window.location.assign('/login')
  }

  console.dir(error);
  return Promise.reject(error);
});


export default instance;