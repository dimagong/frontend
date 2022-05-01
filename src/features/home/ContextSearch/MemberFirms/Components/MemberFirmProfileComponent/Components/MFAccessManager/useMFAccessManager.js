import React from "react";
import { merge, concat, toArray, map } from "rxjs";

import { useAsync } from "hooks/useAsync";

import { RoleBdmService } from "api/roleBdm/roleBdmService";

const getAllBdmUsers$ = ({ memberFirmId }) =>
  merge(
    RoleBdmService.getBdmUsersByMemberFirm$({ memberFirmId }),
    RoleBdmService.getPotentialBdmUsersByMemberFirm$({ memberFirmId })
  ).pipe(
    toArray(),
    map(([{ data: active }, { data: potential }]) => ({ active, potential }))
  );

const syncBdmUsers$ = ({ memberFirmId, bdmUsersIds }) =>
  concat(
    RoleBdmService.putPotentialBdmUsersByMemberFirm$({ memberFirmId, bdmUsersIds }),
    RoleBdmService.getPotentialBdmUsersByMemberFirm$({ memberFirmId })
  ).pipe(
    toArray(),
    map(([{ data: active }, { data: potential }]) => ({ active, potential }))
  );

export const useMFAccessManager = (memberFirmId) => {
  const [state, run] = useAsync({ useObservable: true });

  const getAllBdmUsers = React.useCallback(({ memberFirmId }) => run(getAllBdmUsers$({ memberFirmId })), [run]);

  const syncBdmUsers = React.useCallback(
    ({ memberFirmId, bdmUsersIds }) => run(syncBdmUsers$({ memberFirmId, bdmUsersIds })),
    [run]
  );

  React.useEffect(() => void getAllBdmUsers({ memberFirmId }).subscribe(), [getAllBdmUsers, memberFirmId]);

  return [state, { syncBdmUsers }];
};
