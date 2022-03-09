import _ from "lodash/fp";

export const selectMasterSchemas = _.get("app.masterSchema.masterSchemas");

export const selectSelectedMasterSchema = _.get("app.masterSchema.selectedMasterSchema");

export const selectSelectedMasterSchemaId = _.getOr(null, "app.masterSchema.selectedMasterSchema.id");

export const selectMasterSchemaHierarchy = (msId) => _.get(`app.masterSchema.hierarchies.${msId}`);

export const selectMasterSchemaUnapprovedFields = (msId) => _.get(`app.masterSchema.unapprovedFields.${msId}`);

export const selectAllMasterSchemaGroups = (msId) => _.get(`app.masterSchema.groups.${msId}`);

export const selectAllMasterSchemaGroupsAsOptions = (msId) => _.pipe(
  _.getOr([], `app.masterSchema.groups.${msId}`),
  _.map((group) => ({ label: group.name, value: group }))
);

export const selectMasterSchemaUsers = (state) => state?.app?.masterSchema.users;

export const selectMasterSchemaFields = (state) => state?.app?.masterSchema.fields;

export const selectRelatedApplications = fieldId => state => state?.app?.masterSchema?.related_applications[fieldId];
