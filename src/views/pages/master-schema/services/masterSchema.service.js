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

  updateField({id, name}) {
    return axios.put(`/api/master-schema-field/${id}`, {
      name
    });
  }

  deleteField({id}) {
    return axios.delete(`/api/master-schema-field/${id}`);
  }

  updateGroup({id, name}) {
    return axios.put(`/api/master-schema-group/${id}`, {
      name
    });
  }

  deleteGroup({id}) {
    return axios.delete(`/api/master-schema-group/${id}`);
  }

  addField({name, master_schema_group_id}) {
    return axios.post(`/api/master-schema-field`, {
      name,
      master_schema_group_id
    });
  }

  addGroup({name, parent_id}) {
    return axios.post(`/api/master-schema-group`, {
      name,
      parent_id
    });
  }
}

const masterSchemaService = new MasterSchemaService();
Object.freeze(masterSchemaService);

export default masterSchemaService;
