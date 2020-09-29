import axios from '../overrides/axios';
import {isEmpty} from 'lodash'

class UserService {
  getProfile() {
    return axios.get("/api/user/profile");
  }

  createUser({first_name, last_name, postcode, number, email, password, valid_until, groups, roles}) {
    return axios.post("/api/user", {first_name, last_name, postcode, number, email, password, valid_until, groups, roles});
  }

  updateUser({id, first_name, last_name, postcode, number, email, valid_until, groups, roles, onboarding, modules}) {
    return axios.put("/api/user/" + id, {first_name, last_name, postcode, number, email, valid_until, groups, roles, onboarding, modules});
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
    if(isEmpty(userProfile)) return true;

    if (userProfile.roles.indexOf('prospect') !== -1) {
      return true;
    }
    return false;
  }

  isManager(userProfile) {
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

  isShowProtectedElements(user) {
    return !user.roles.some(role =>  ['corporate_manager', 'member_firm_manager', 'adviser', 'admin'].indexOf(role) !== -1);
  }
}

const userService = new UserService();
Object.freeze(userService);

export default userService;
