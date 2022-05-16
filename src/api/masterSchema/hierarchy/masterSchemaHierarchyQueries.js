import { createQueryKey } from "api/createQueryKey";
import { useGenericQuery } from "api/useGenericQuery";
import { useGenericMutation } from "api/useGenericMutation";

import { MasterSchemaHierarchyDTO } from "./masterSchemaHierarchyDTO";

export const MasterSchemaHierarchyQueryKey = createQueryKey("master-schema-hierarchy");

export const MasterSchemaHierarchyQueryKeys = {
  all: () => [MasterSchemaHierarchyQueryKey],
  get: (masterSchemaId) => [...MasterSchemaHierarchyQueryKeys.all(), masterSchemaId],
  search: (masterSchemaId, params) => [...MasterSchemaHierarchyQueryKeys.get(masterSchemaId), params],
  getByUser: (userId) => [...MasterSchemaHierarchyQueryKeys.all(), "by-user", userId],
  searchByUser: (userId, params) => [...MasterSchemaHierarchyQueryKeys.getByUser(userId), params],
};

export const useMasterSchemaHierarchyByUser = (params, options) => {
  return useGenericQuery(
    {
      url: "api/master-schema/get-hierarchy-by-user",
      queryKey: MasterSchemaHierarchyQueryKeys.searchByUser(params.userId, params),
      params: {
        name: params.name,
        // user_id is required, luck to current API it is not in route path.
        user_id: params.userId,
        only_files: Number(params.onlyFiles),
        date_end: params.dateEnd,
        date_begin: params.dateBegin,
        application_ids: params.applicationIds,
        show_empty_folders: Number(params.showEmptyFolders),
        // Without unapproved fields
        hidden_groups: [1],
        only_user_fields: 0,
      },
    },
    {
      select: MasterSchemaHierarchyDTO.parse,
      ...options,
    }
  );
};

export const useCreateMasterSchemaField = (options) => {
  return useGenericMutation(
    {
      url: "api/master-schema-field",
      method: "post",
      // This will invalidate all queries which start with [MasterSchemaHierarchyQueryKey]
      // So query which is [MasterSchemaHierarchyQueryKey, masterSchemaId, params]
      // and query which is [MasterSchemaHierarchyQueryKey, params]
      // both that queries will be invalidated
      // So, master schema field creation will affect on all hierarchy in cache
      queryKey: MasterSchemaHierarchyQueryKeys.all(),
    },
    options
  );
};

export const useCreateMasterSchemaGroup = (options) => {
  return useGenericMutation(
    {
      url: "api/master-schema-group",
      method: "post",
      queryKey: MasterSchemaHierarchyQueryKeys.all(),
    },
    options
  );
};
