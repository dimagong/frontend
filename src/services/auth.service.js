import axios from '../overrides/axios';

const TOKEN_KEY = 'token';

class AuthService {

    isAuth() {
        return !!localStorage.getItem(TOKEN_KEY);
    }

    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }

    removeToken(token) {
        localStorage.removeItem(TOKEN_KEY, token);
    }

    login({ email, password, device_name, code }) {
        return axios.post("/api/login", {
            email: email,
            password: password,
            device_name: device_name,
            code: code
        });
    }

    logout() {
        return axios.post("/api/logout");
    }
}

const authService = new AuthService();
Object.freeze(authService);

export default authService;
