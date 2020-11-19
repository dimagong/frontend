import axios from 'api';

class MasterSchemaService {
  getOrganizations() {
    return axios.get('/api/master-schema/organizations');
  }

  getByOrganization(type, id) {
    return axios.get(`/api/master-schema/organization/${type}/${id}`);
  }

  create(type, id) {
    return axios.post('/api/master-schema', {
      organization_id: id,
      organization_type: type
    });
  }
}

const masterSchemaService = new MasterSchemaService();
Object.freeze(masterSchemaService);

export default masterSchemaService;
