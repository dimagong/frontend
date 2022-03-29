import { useQuery } from "react-query";
import { clientAPI } from "../clientAPI";

export const ResourceManagersQueryKey = "resource-managers";

export const useResourceManagers = (options = {}) => {
  return useQuery({
    queryKey: ResourceManagersQueryKey,
    queryFn: ({ signal }) => clientAPI.get("api/resource-manager", { signal }),
    ...options,
  });
};
