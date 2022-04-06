import { useQuery } from "react-query";

import { clientAPI } from "api/clientAPI";

export const DFormsKey = "get-dforms";

export const useDForms = () => {
  return useQuery({
    queryKey: [DFormsKey],
    queryFn: () => clientAPI.get(`/api/dform-template`),
  });
};
