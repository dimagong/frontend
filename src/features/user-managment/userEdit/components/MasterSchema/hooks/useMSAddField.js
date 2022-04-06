import {useGenericMutation} from "api/useGenericMutation";
import {clientAPI} from "api/clientAPI";
import {MSHierarchyKey} from "./useMSHierarchy";

export const useMSAddField = (userId, hierarchy, options = {}) => {
  return useGenericMutation({
    mutationFn: ({ name, parentId }) =>
      clientAPI
        .post("/api/master-schema-field", {
          name,
          master_schema_group_id: parentId,
        })
        .then(() =>
          hierarchy.refetch()
        ),
        queryKey: [MSHierarchyKey, userId],
        ...options,
  });
};
