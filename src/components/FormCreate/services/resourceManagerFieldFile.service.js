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

  exportResourceFromOnboarding(onboardingId, masterSchemaFieldId, resourceManagerFieldFileId) {
    return axios.post(
      `/api/resource-manager-field-file/${resourceManagerFieldFileId}/references/export-from-onboarding`,
      {
        master_schema_field_id: masterSchemaFieldId,
        onboarding_id: onboardingId,
      }
    );
  }
}

const fileService = new ResourceManagerFieldFileService();
Object.freeze(fileService);

export default fileService;
