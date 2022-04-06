import {useGenericMutation} from "api/useGenericMutation";
import {clientAPI} from "api/clientAPI";
import {MSHierarchyKey} from "./useMSHierarchy";

export const useMSAddGroup = (userId, hierarchy, options = {}) => {
  return useGenericMutation({
    mutationFn: ({ name, parentId }) =>
      clientAPI
        .post("/api/master-schema-group", {
          name,
          parent_id: parentId,
        })
        .then(() =>
          hierarchy.refetch()
        ),
        queryKey: [MSHierarchyKey, userId],
        ...options,
  });
};
