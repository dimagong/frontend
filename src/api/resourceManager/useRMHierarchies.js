import { useQuery } from "react-query";

import { clientAPI } from "../clientAPI";
import * as Interfaces from "../masterSchema/interfaces";
import { useGenericMutation } from "../useGenericMutation";
import { normalizeHierarchy } from "../masterSchema/normalizers";

export const RMHierarchyQueryKey = "resource-manager-hierarchies";

export const useRMHierarchy = ({ resourceManagerId }, options = {}) => {
  return useQuery({
    queryKey: [RMHierarchyQueryKey, resourceManagerId],
    queryFn: ({ signal }) =>
      clientAPI
        .get(`api/resource-manager/${resourceManagerId}/hierarchy`, { signal })
        .then((data) => Interfaces.MasterSchemaHierarchyInterface.cast(data))
        .then((data) => (data ? normalizeHierarchy(data) : null)),

    ...options,
  });
};

export const useCreateRMHierarchyField = ({ resourceManagerId }) => {
  return useGenericMutation({
    mutationFn: (data) => clientAPI.post("api/resource-manager-field", data),
    queryKey: [RMHierarchyQueryKey, resourceManagerId],
  });
};

export const useSetRMHierarchyFieldCustomFilename = ({ resourceManagerId, fieldId }, options = {}) => {
  return useGenericMutation({
    mutationFn: ({ custom_filename }) => clientAPI.put(`api/resource-manager-field/${fieldId}`, { custom_filename }),
    queryKey: [RMHierarchyQueryKey, resourceManagerId],
    ...options,
  });
};

export const useCreateRMHierarchyGroup = ({ resourceManagerId }) => {
  return useGenericMutation({
    mutationFn: (data) => clientAPI.post("api/resource-manager-directory", data),
    queryKey: [RMHierarchyQueryKey, resourceManagerId],
  });
};
