import instance from "api";
import authService from "services/auth"

const authApi = {
  async login(data) {
    try {
      const result = await instance({
        url: "/authenticate",
        method: "POST",
        data,
      });
      authService.setToken(result.data.data.token)

      return result;
    } catch (err) {
      throw err;
    }
  },
  async signUp(data) {
    try {
      const result = await instance({
        url: "/authenticate/register",
        method: "POST",
        data,
      });

      return result;
    } catch (err) {
      throw err;
    }
  },
  async resetPassword({ password, token }) {
    try {
      return await instance({
        url: `/authenticate/remind-password/`,
        method: "POST",
        data: { password: password },
        params: {
          token,
        },
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

  async sendEmail(data) {
    try {
      return await instance({
        url: "/authenticate",
        method: "POST",
        data: {
          email: data,
        },
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

  async verify(data) {
    try {
      const result = await instance({
        url: "/authenticate/verify",
        method: "POST",
        data,
      });


      return result;
    } catch (err) {
      throw err;
    }
  },

  logout() {
    authService.logout()


    return true;
  },
};

export default authApi;
