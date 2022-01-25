export const getResourceManagersListUrl = "api/resource-manager";
export const getResourceManagerHierarchy = (resourceManagerId) => `api/resource-manager/${resourceManagerId}/hierarchy`;
export const createFolderInResourceManagerHierarchy = "api/resource-manager-directory";
export const createFieldInResourceManagerHierarchy = "api/resource-manager-field";
export const getResourcePreviousVersions = (fieldId) => `api/resource-manager-field-file/${fieldId}/versions`;
export const getResourceConnections = "api/resource-manager-field-value";
export const uploadResourceUrl = "api/resource-manager-field-file";
export const removeResourceFile = "api/resource-manager-field-file";
export const downloadResourceFile = "api/resource-manager-field-file";
