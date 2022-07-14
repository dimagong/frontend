import { createQueryKey } from "api/createQueryKey";
import { useGenericQuery } from "api/useGenericQuery";

export const ProspectUserProfileQueryKey = createQueryKey("Prospect User profile");
export const ProspectUserSurvayPassingQueryKey = createQueryKey("Prospect User Survay Passing");

export const ProspectUserProfileKeys = {
  all: () => [ProspectUserProfileQueryKey],
};

export const ProspectUserSurvayKeys = {
  all: () => [ProspectUserSurvayPassingQueryKey],
};

export const useProspectUserProfileQuery = (options = {}) => {
  //const dispatch = useDispatch();
  return useGenericQuery(
    {
      url: `/member-view-api/user/profile`,
      queryKey: [...ProspectUserProfileKeys.all()],
    },
    {
      onError: (error) => {
        console.log("ERROR useProspectUserProfileQuery", error);
        //dispatch(getMemberFirmsError(error.message))
      },
      onSuccess: (data) => {
        console.log("SUCCESS useProspectUserProfileQuery", data);
        //dispatch(getMemberFirmsSuccess(data))
      },
      ...options,
    }
  );
};

export const useSurvayPassingQuery = (options = {}) => {
  return useGenericQuery(
    {
      url: `/member-view-api/survey-passing`,
      queryKey: [...ProspectUserSurvayKeys.all()],
    },
    {
      onError: (error) => {
        console.log("ERROR useSurvayPassingQuery", error);
        //dispatch(getMemberFirmsError(error.message))
      },
      onSuccess: (data) => {
        console.log("SUCCESS useSurvayPassingQuery", data);
        //dispatch(getMemberFirmsSuccess(data))
      },
      ...options,
    }
  );
};
