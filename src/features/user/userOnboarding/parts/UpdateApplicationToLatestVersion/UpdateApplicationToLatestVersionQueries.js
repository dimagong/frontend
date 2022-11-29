import { toast } from "react-toastify";

import { useGenericMutation } from "api/useGenericMutation";

import { DFormQueryKeys } from "../../../userEdit/userQueries";

export const useUpdateApplicationToLatestVersionMutation = (applicationId) => {
  return useGenericMutation(
    {
      url: `/api/dform/${applicationId}/update-from-parent`,
      method: "put",
      queryKey: DFormQueryKeys.byId(applicationId),
    },
    {
      onSuccess: () => {
        toast.success("Application updated");
      },
    }
  );
};
