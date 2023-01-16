import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import { selectAuth } from "app/selectors";

import { ProfileService } from "../services/profileService";

const { getProfileError } = appSlice.actions as any;
const { getProfileSuccess } = appSlice.actions as any;

export const ProfileQueryKeys = {
  all: () => ["Profile"],
};

export const useProfileQuery = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectAuth);

  return useQuery({
    enabled: isAuth,
    queryKey: ProfileQueryKeys.all(),
    queryFn: ({ signal }) => ProfileService.get(),
    onSuccess: (data) => {
      // The `getProfileSuccess` reducer set a payload's data into state.user.profile with onboarding: []
      // in the src/app/reducers/app/user/userReducers.js line=6
      dispatch(getProfileSuccess(data));
    },
    onError: (error) => {
      dispatch(getProfileError(error));
    },
  });
};
