import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { selectAuth } from "app/selectors";
import { createQueryKey } from "api/createQueryKey";

import { ManagerProfileService } from "../services/profileService";

const { getProfileSuccess, getProfileError } = appSlice.actions;

const ProfileQueryKey = createQueryKey("Profile");

export const ProfileQueryKeys = {
  all: () => [ProfileQueryKey],
};

export const useProfileQuery = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectAuth);

  return useQuery({
    enabled: isAuth,
    queryKey: ProfileQueryKeys.all(),
    queryFn: () => ManagerProfileService.instance.get(),
    onSuccess: (data) => {
      const rawData: unknown = data;
      // @ts-ignore
      dispatch(getProfileSuccess(rawData));
    },
    onError: (error) => {
      // @ts-ignore
      dispatch(getProfileError(error));
    },
  });
};
