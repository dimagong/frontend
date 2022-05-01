import axios from "../overrides/axios";

class GroupsRelationsService {
  getAll() {
    return axios.get("/api/groups-relations");
  }

  getByUserId(userId) {
    return axios.get("/api/groups-relations/" + userId);
  }
}

const groupsRelationsService = new GroupsRelationsService();
Object.freeze(groupsRelationsService);

export default groupsRelationsService;
