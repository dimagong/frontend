import instance from "api";
import authService from "services/auth";
import { loginPath, resetPasswordPath, verifyPasswordPath } from "constants/auth";

const authApi = {
  async login(data) {
    try {

      // await instance({
      //   url: '/sanctum/csrf-cookie',
      //   method: 'GET'
      // });

      const result = await instance({
        url: loginPath,
        method: "POST",
        data,
      });
      authService.setToken(result.data.data.token);

      return result;
    } catch (err) {
      throw err;
    }
  },

  async resetPassword({ email }) {
    try {
      return await instance({
        url: resetPasswordPath,
        method: "POST",
        data: { email },
      });
    } catch (err) {
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.detail
      ) {
        throw Error(err.response.data.detail);
      }
      throw Error("Something is wrong");
    }
  },

  async verifyPassword(data) {
    try {
      const result = await instance({
        url: verifyPasswordPath,
        method: "POST",
        data,
      });

      return result;
    } catch (err) {
      throw err;
    }
  },



  async logout() {
    try {
      await instance({
        url: '/api/logout',
        method: 'POST'
      });
      authService.logout();
    } catch (e) {
        return false;
    }

    return true;
  },
};

export default authApi;
