import axios from '../overrides/axios';

class GroupService {
    getAll() {
        return axios.get("/api/group/all");
    }
}

const groupService = new GroupService();
Object.freeze(groupService);

export default groupService;