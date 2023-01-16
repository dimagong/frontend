import type { FC, ReactNode } from "react";
import React, { createContext, useContext } from "react";

import { DformAccessTypes } from "../types";
import { isDFormAccessible } from "../data/isDFormAccessible";
import { DformFileService } from "../data/services/dformFileService";
import { DformId } from "../data/models";
import { APIPrefix } from "../../common";

type DFormContextValue = {
  dformId: DformId;
  dformFileService: DformFileService;
  accessType: DformAccessTypes;
  isAccessible: boolean;
};

const defaultValue: DFormContextValue = {
  dformId: -1 as unknown as DformId,
  accessType: DformAccessTypes.HardLock,
  isAccessible: false,
  dformFileService: new DformFileService(APIPrefix.API),
};

const dformContext = createContext(defaultValue);

let memberDFormFileService: DformFileService;
let managerDFormFileService: DformFileService;
const getDFormFileService = (isMemberView: boolean): DformFileService => {
  if (isMemberView) {
    if (!memberDFormFileService) {
      memberDFormFileService = new DformFileService(APIPrefix.Member);
    }
    return memberDFormFileService;
  }

  if (!managerDFormFileService) {
    managerDFormFileService = new DformFileService(APIPrefix.API);
  }
  return managerDFormFileService;
};

type Props = {
  dformId: DformId;
  accessType?: DformAccessTypes;
  isMemberView?: boolean;
  children: ReactNode;
};

const Provider: FC<Props> = (props) => {
  const { dformId, accessType, isMemberView = false, children } = { ...defaultValue, ...props };

  const isAccessible = isDFormAccessible(accessType, isMemberView);
  const dformFileService = getDFormFileService(isMemberView);

  return <dformContext.Provider value={{ dformId, dformFileService, accessType, isAccessible }} children={children} />;
};

export const DFormContext = { Provider, Consumer: dformContext.Consumer, useContext: () => useContext(dformContext) };
