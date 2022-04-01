import axios from 'api';

class ResourceManagerFieldFileService {
  resourceManagerFieldFiles(organizationId, organizationType) {
    return axios.get('/api/resource-manager-field-file', {
      params: {
        organization_id: organizationId,
        organization_type: organizationType,
        is_latest_version: 1
      }
    });
  }
}

const fileService = new ResourceManagerFieldFileService();
Object.freeze(fileService);

export default fileService;
