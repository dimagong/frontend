export const postMasterSchemaFieldUrl = "/api/master-schema-field";
export const postMasterSchemaGroupUrl = "/api/master-schema-group";
export const putMasterSchemaFieldUrl = (id) => `/api/master-schema-field/${id}`;
export const putMasterSchemaGroupUrl = (id) => `/api/master-schema-group/${id}`;
export const putMasterSchemaFieldMakeParentUrl = (fieldId) => `/api/master-schema-field/${fieldId}/make-parent`;
export const putMasterSchemaGroupMakeParentUrl = (groupId) => `/api/master-schema-group/${groupId}/make-parent`;
export const getMasterSchemaOrganizationsUrl = "/api/master-schema/organizations";
export const getMasterSchemaListUrl = "/api/master-schema";
export const getMasterSchemaHierarchyUrl = (id) => `/api/master-schema/${id}/get-hierarchy`;
