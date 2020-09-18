import axios from '../overrides/axios';

class GroupsRelationsService {

    getAll() {
        return axios.get('/api/groups-relations');
    }
}

const groupsRelationsService = new GroupsRelationsService();
Object.freeze(groupsRelationsService);

export default groupsRelationsService;
