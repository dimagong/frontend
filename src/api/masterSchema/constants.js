export const getMasterSchemaListUrl = "/api/master-schema";
export const getMasterSchemaOrganizationsUrl = "/api/master-schema/organizations";
export const getMasterSchemaHierarchyUrl = (id) => `/api/master-schema/${id}/get-hierarchy`;
export const getMasterSchemaHierarchyByUserUrl = "/api/master-schema/get-hierarchy-by-user";
export const getMasterSchemaUnapprovedUrl = (id) => `/api/master-schema/${id}/unapproved`;
export const postMasterSchemaFieldUrl = "/api/master-schema-field";
export const postMasterSchemaGroupUrl = "/api/master-schema-group";
export const putMasterSchemaFieldUrl = (id) => `/api/master-schema-field/${id}`;
export const putMasterSchemaGroupUrl = (id) => `/api/master-schema-group/${id}`;
export const putMasterSchemaFieldMakeParentUrl = (fieldId) => `/api/master-schema-field/${fieldId}/make-parent`;
export const putMasterSchemaGroupMakeParentUrl = (groupId) => `/api/master-schema-group/${groupId}/make-parent`;
export const putMasterSchemaFieldsMakeParentUrl = "/api/master-schema-field/make-parent-many";
export const getMasterSchemaUsersByFieldUrl = (fieldId) => `/api/master-schema-field/${fieldId}/users`;
export const getMasterSchemaRelatedApplications = (fieldId) =>
  `/api/master-schema-field/${fieldId}/related-applications`;
export const putMasterSchemaMergeFields = (fieldId) => `/api/master-schema-field/${fieldId}/merge`;
export const getMasterSchemaGroupsUrl = (id) => `/api/master-schema/${id}/groups`;
export const getMasterSchemaFieldVersions = (fieldId) => `/api/master-schema-field-value/${fieldId}/versions`;
export const getMasterSchemaVersionsByFieldAndUser = "/api/master-schema-field-value-version";
