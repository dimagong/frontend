import axios from 'api';

// ToDo: Refactor it
class ResourceManagerFieldFileService {
  resourceManagerFields(organizationId, organizationType) {
    return axios.get('/api/resource-manager-field/get-fields', {
      params: {
        organization_id: organizationId,
        organization_type: organizationType,
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
