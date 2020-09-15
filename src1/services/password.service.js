import axios from '../overrides/axios';

class PasswordService {

  reset(email, token, password, password_confirmation) {
    return axios.post("/api/password/reset", {
      email,
      token,
      password,
      password_confirmation
    });
  }

  forgot(email) {
    return axios.post("/api/password/email", {
      email
    });
  }
}

const passwordService = new PasswordService();
Object.freeze(passwordService);

export default passwordService;
