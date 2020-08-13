import axios from '../overrides/axios';

class RoleService {
    getAll() {
        return axios.get("/api/role/all");
    }
}

const roleService = new RoleService();
Object.freeze(roleService);

export default roleService;