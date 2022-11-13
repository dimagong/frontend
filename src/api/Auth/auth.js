import instance from "api";
import authService from "services/auth";

const authApi = {
  async logout() {
    try {
      await instance({
        url: "/api/logout",
        method: "POST",
      });
      authService.logout();
    } catch (e) {
      return false;
    }

    return true;
  },
};

export default authApi;
