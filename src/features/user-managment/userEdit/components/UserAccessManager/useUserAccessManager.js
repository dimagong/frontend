import React from "react";
import { merge, concat, toArray, map } from "rxjs";

import { useAsync } from "hooks/useAsync";

import { RoleBdmService } from "api/roleBdm/roleBdmService";

const getAllBdmUsers$ = ({ userId }) =>
  merge(RoleBdmService.getActiveBdmUsers$({ userId }), RoleBdmService.getPotentialBdmUsers$({ userId })).pipe(
    toArray(),
    map(([{ data: active }, { data: potential }]) => ({ active, potential }))
  );

const syncBdmUsers$ = ({ userId, bdmUsersIds }) =>
  concat(
    RoleBdmService.putPotentialBdmUsers$({ userId, bdmUsersIds }),
    RoleBdmService.getPotentialBdmUsers$({ userId })
  ).pipe(
    toArray(),
    map(([{ data: active }, { data: potential }]) => ({ active, potential }))
  );

export const useUserAccessManager = (userId) => {
  const [state, run] = useAsync({ useObservable: true });

  const getAllBdmUsers = React.useCallback(({ userId }) => run(getAllBdmUsers$({ userId })), [run]);

  const syncBdmUsers = React.useCallback(
    ({ userId, bdmUsersIds }) => run(syncBdmUsers$({ userId, bdmUsersIds })),
    [run]
  );

  React.useEffect(() => void getAllBdmUsers({ userId }).subscribe(), [getAllBdmUsers, userId]);

  return [state, { syncBdmUsers }];
};
