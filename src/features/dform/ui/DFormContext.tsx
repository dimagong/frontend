import type { FC, ReactNode } from "react";
import React, { createContext, useContext } from "react";

import { DFormAccessTypes } from "../types";
import { DformFileService } from "../data/dformFileService";
import { isDFormAccessible } from "../data/isDFormAccessible";

type DFormContextValue = {
  dformId?: number;
  dformFileService: DformFileService;
  accessType: DFormAccessTypes;
  isAccessible: boolean;
};

const defaultValue: DFormContextValue = {
  accessType: DFormAccessTypes.HardLock,
  isAccessible: false,
  dformFileService: DformFileService.create(),
};

const dformContext = createContext(defaultValue);

let memberDFormFileService: DformFileService;
let managerDFormFileService: DformFileService;
const getDFormFileService = (isMemberView: boolean): DformFileService => {
  if (isMemberView) {
    if (!memberDFormFileService) {
      memberDFormFileService = DformFileService.create({ isMemberView });
    }
    return memberDFormFileService;
  }

  if (!managerDFormFileService) {
    managerDFormFileService = DformFileService.create({ isMemberView });
  }
  return managerDFormFileService;
};

type Props = {
  dformId?: number;
  accessType?: DFormAccessTypes;
  isMemberView?: boolean;
  children: ReactNode;
};

const Provider: FC<Props> = (props) => {
  const { dformId, accessType, isMemberView = false, children } = { ...defaultValue, ...props };

  const isAccessible = isDFormAccessible(accessType, isMemberView);
  const dformFileService = getDFormFileService(isMemberView);

  return <dformContext.Provider value={{ dformId, dformFileService, accessType, isAccessible }} children={children} />;
};

const useDFormContext = () => useContext(dformContext);

export const DFormContext = { Provider, Consumer: dformContext.Consumer, useContext: useDFormContext };
