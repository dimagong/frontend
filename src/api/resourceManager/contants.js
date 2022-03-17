export const getResourceManagersListUrl = "api/resource-manager";
export const getResourceManagerHierarchy = (resourceManagerId) => `api/resource-manager/${resourceManagerId}/hierarchy`;
export const createFolderInResourceManagerHierarchy = "api/resource-manager-directory";
export const createFieldInResourceManagerHierarchy = "api/resource-manager-field";
export const getResourcePreviousVersions = (fieldId) => `api/resource-manager-field-file/${fieldId}/files`;
export const getResourceConnections = "api/resource-manager-field-value";
export const uploadResourceUrl = "api/resource-manager-field-file";
export const removeResourceTemplateUrl = (resourceFileId) => `api/resource-manager-field-file/${resourceFileId}`;
export const downloadResourceFile = (resourceFileId) => `api/resource-manager-field-file/${resourceFileId}/download`;
export const postEditField = (resourceFileId) => `api/resource-manager-field-file/${resourceFileId}/edit`;
export const endEditField = (resourceFileId) => `api/resource-manager-field-file/${resourceFileId}`;

