import axios from '../overrides/axios';

class UserService {
  getProfile() {
    return axios.get("/api/user/profile");
  }

  createUser({name, number, email, password, valid_until, groups, roles}) {
    return axios.post("/api/user", {name, number, email, password, valid_until, groups, roles});
  }

  updateUser({id, name, number, email, valid_until, groups, roles, onboarding, modules}) {
    return axios.put("/api/user/" + id, {name, number, email, valid_until, groups, roles, onboarding, modules});
  }

  remove(id) {
    return axios.delete("/api/user/" + id);
  }

  getAll(page = 1) {
    return axios.get("api/user", {
      params: {
        page: page
      }
    });
  }

  updateRoles({id, roles}) {
    return axios.put(`/api/user/${id}/roles`, {roles});
  }

  updateGroups({id, groups}) {
    return axios.put(`/api/user/${id}/groups`, {groups});
  }

  getUserById(id) {
    return axios.get(`/api/user/${id}`);
  }

  getByEmail(email = '', page = 1) {
    return axios.get(`/api/user/getByEmail`, {
      params: {
        page,
        email
      }
    });
  }

  isOnboarding(userProfile) {

    if(!('onboarding' in userProfile)) return true;

    if (
      userProfile &&
      (Array.isArray(userProfile.roles) &&
      userProfile.roles.indexOf('prospect') !== -1)
    ) {
      return true;
    }
    return false;
  }

  isManager(userProfile) {
    console.log('userProfile', userProfile);
    if(!('onboarding' in userProfile)) return true;
    if (
      userProfile &&
      (userProfile.onboarding ||
        Array.isArray(userProfile.roles) &&
        userProfile.roles.indexOf('prospect') !== -1)
    ) {
      return true;
    }
    return false;
  }

}

const userService = new UserService();
Object.freeze(userService);

export default userService;
