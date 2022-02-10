import instance from "api";
import { get, pipe } from "lodash/fp";

import { masterSchemaOrganizations } from "constants/masterSchema";

import * as Urls from "./constants";
import * as Interfaces from "./interfaces";
import { MasterSchemaFlatGroupsInterface, MasterSchemaGroupsInterface } from "./interfaces";

const flatResponseData = get("data.data");
const flatResponseError = pipe(get("response.data.error"), (e) => Promise.reject(e));

const masterSchemaApi = {
  getOrganizations() {
    return instance({
      method: "GET",
      url: Urls.getMasterSchemaOrganizationsUrl,
    }).then(flatResponseData, flatResponseError);
  },

  getList() {
    return instance({
      method: "GET",
      url: Urls.getMasterSchemaListUrl,
    })
      .then(flatResponseData, flatResponseError)
      .then((data) => Interfaces.MasterSchemaArrayInterface.validate(data));
  },

  // renaming refactor - at the end remove getList method.
  getAll() {
    return masterSchemaApi.getList();
  },

  getHierarchy({ masterSchemaId, name, application_ids, date_begin, date_end }) {
    return instance({
      method: "GET",
      url: Urls.getMasterSchemaHierarchyUrl(masterSchemaId),
      params: {
        hidden_groups: [1],
        ...(name ? { name } : {}),
        ...(date_end ? { date_end } : {}),
        ...(date_begin ? { date_begin } : {}),
        ...(application_ids ? { application_ids } : {}),
      },
    })
      .then(flatResponseData, flatResponseError)
      .then((data) => Interfaces.MasterSchemaHierarchyInterface.validate(data));
  },

  getHierarchyByUserId(user_id, { name, application_ids, only_files, date_begin, date_end, show_empty_folders } = {}) {
    return instance({
      method: "GET",
      url: Urls.getMasterSchemaHierarchyByUserUrl,
      params: {
        user_id,
        hidden_groups: [1],
        only_user_fields: 0,
        only_files: only_files ? 1 : 0,
        show_empty_folders: show_empty_folders ? 1 : 0,
        ...(name ? { name } : {}),
        ...(date_end ? { date_end } : {}),
        ...(date_begin ? { date_begin } : {}),
        ...(application_ids ? { application_ids } : {}),
      },
    })
      .then(flatResponseData, flatResponseError)
      .then((response) => Interfaces.MasterSchemaHierarchyInterface.cast(response))
      .then((serialized) => Interfaces.MasterSchemaHierarchyInterface.validate(serialized));
  },

  getAllMasterSchemaGroups({ masterSchemaId }) {
    return instance({
      method: "GET",
      url: Urls.getMasterSchemaGroupsUrl(masterSchemaId),
      params: { hidden_groups: [1] },
    })
      .then(flatResponseData, flatResponseError)
      .then((data) => Interfaces.MasterSchemaFlatGroupsInterface.validate(data))
  },

  getUnapprovedFields({ masterSchemaId }) {
    return instance({
      method: "GET",
      url: Urls.getMasterSchemaUnapprovedUrl(masterSchemaId),
    })
      .then(flatResponseData, flatResponseError)
      .then((data) => Interfaces.MasterSchemaUnapprovedFieldsInterface.validate(data))
  },

  // refactored above

  addField({ name, parentId }) {
    return instance({
      method: "POST",
      url: Urls.postMasterSchemaFieldUrl,
      data: { name, master_schema_group_id: parentId },
    }).then(flatResponseData, flatResponseError);
  },

  addGroup({ name, parentId }) {
    return instance({
      method: "POST",
      url: Urls.postMasterSchemaGroupUrl,
      data: { name, parent_id: parentId },
    }).then(flatResponseData, flatResponseError);
  },

  updateField({ id, name }) {
    return instance({
      method: "PUT",
      url: Urls.putMasterSchemaFieldUrl(id),
      data: { name },
    }).then(flatResponseData, flatResponseError);
  },

  updateGroup({ id, name }) {
    return instance({
      method: "PUT",
      url: Urls.putMasterSchemaGroupUrl(id),
      data: { name },
    }).then(flatResponseData, flatResponseError);
  },

  fieldMakeParent({ nodeId, parentId }) {
    return instance({
      method: "PUT",
      url: Urls.putMasterSchemaFieldMakeParentUrl(nodeId),
      data: { master_schema_group_id: parentId },
    }).then(flatResponseData, flatResponseError);
  },

  groupMakeParent({ nodeId, parentId }) {
    return instance({
      method: "PUT",
      url: Urls.putMasterSchemaGroupMakeParentUrl(nodeId),
      data: { parent_id: parentId },
    }).then(flatResponseData, flatResponseError);
  },

  fieldsMakeParent({ parentId, fieldsIds }) {
    return instance({
      method: "PUT",
      url: Urls.putMasterSchemaFieldsMakeParentUrl,
      data: {
        master_schema_group_id: parentId,
        master_schema_field_ids: fieldsIds,
      },
    }).then(flatResponseData, flatResponseError);
  },

  fieldsMerge({ parentId, fieldsIds }) {
    return instance({
      method: "PUT",
      url: Urls.putMasterSchemaMergeFields(parentId),
      data: {
        master_schema_field_ids: fieldsIds,
      },
    }).then(flatResponseData, flatResponseError);
  },

  getRelatedApplications({ fieldId }) {
    return instance({
      method: "GET",
      url: Urls.getMasterSchemaRelatedApplications(fieldId),
    }).then(flatResponseData, flatResponseError);
  },

  getFieldVersions({ fieldId }) {
    return instance({
      method: "GET",
      url: Urls.getMasterSchemaFieldVersions(fieldId),
    }).then(flatResponseData, flatResponseError);
  },

  getVersionsByFieldAndUser({ fieldId, userId }) {
    return instance({
      method: "GET",
      url: Urls.getMasterSchemaVersionsByFieldAndUser,
      params: {
        user_id: userId,
        master_schema_field_id: fieldId,
      },
    }).then(flatResponseData, flatResponseError);
  },

  getUsers({ fieldId, name, abilities, organizations, member_firm_id }) {
    return instance({
      method: "GET",
      url: Urls.getMasterSchemaUsersByFieldUrl(fieldId),
      params: {
        name: name?.length > 0 ? name : undefined,
        abilities: abilities?.length > 0 ? abilities : undefined,
        organizations: organizations?.length > 0 ? organizations : undefined,
        member_firms: member_firm_id?.length > 0 ? member_firm_id : undefined,
      },
    }).then(flatResponseData, flatResponseError);
  },

  getValueFile({ valueId }) {
    return instance({
      url: `api/file/${valueId}/download`,
      method: "GET",
      responseType: "blob",
    }).then(get("data"), flatResponseError);
  },

  async getOrganizationsMasterSchema() {
    try {
      const result = await instance({
        url: masterSchemaOrganizations,
        method: "GET",
      });

      return result.data.data;
    } catch (err) {
      throw err;
    }
  },

  // Get master schema data in csv. expects organization_type, organization_id and optional user_id.
  // Returns master schema data for exact user or for whole organization depending on is user_id passed.
  async getMasterSchemaCsv(data) {
    const result = await instance({
      url: "api/master-schema/export",
      method: "POST",
      responseType: "blob",
      data,
    });

    return result.data;
  },
};

export default masterSchemaApi;
