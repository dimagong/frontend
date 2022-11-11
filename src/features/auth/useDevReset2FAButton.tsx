import React from "react";
import type { ReactNode } from "react";

import { useDev } from "features/common";
import { NmpButton } from "features/nmp-ui";
import { useGenericMutation } from "api/useGenericMutation";

export const useDevReset2FAButton = (userId: number): ReactNode => {
  let button: ReactNode = null;

  useDev(() => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const mutation = useGenericMutation({
      url: `api/user/${userId}/reset-fingerprint`,
      method: "patch",
    });

    button = (
      <NmpButton onClick={() => mutation.mutate()} loading={mutation.isLoading}>
        Reset 2FA
      </NmpButton>
    );
  });

  return button;
};
