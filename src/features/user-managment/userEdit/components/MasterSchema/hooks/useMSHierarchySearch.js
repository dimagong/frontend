import { useQuery } from "react-query";

import { clientAPI } from "api/clientAPI";
import {normalizeHierarchy} from "api/masterSchema/normalizers";

export const MSHierarchySearchKey = "master-schema-hierarchy-search-by-user";

export const useMSHierarchySearch = ({ userId, name, application_ids, only_files, date_begin, date_end, show_empty_folders }, options) => {
  const {data, ...states} = useQuery({
    queryKey: [MSHierarchySearchKey, { userId, name, application_ids, only_files, date_begin, date_end, show_empty_folders }],
    queryFn: () =>
      clientAPI.get(`/api/master-schema/get-hierarchy-by-user`, {
        params: {
          user_id: userId,
          hidden_groups: [1],
          only_user_fields: 0,
          only_files: only_files ? 1 : 0,
          show_empty_folders: show_empty_folders ? 1 : 0,
          ...(name ? { name } : {}),
          ...(date_end ? { date_end } : {}),
          ...(date_begin ? { date_begin } : {}),
          ...(application_ids ? { application_ids } : {}),
        }
      }),
    ...options,
  });

  return {
    data: data ? normalizeHierarchy(data) : null,
    ...states
  }
};
