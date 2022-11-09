import type { FC, ReactNode } from "react";
import React, { createContext, useContext } from "react";

import { DformAccessTypes } from "../types";
import { isDFormAccessible } from "../data/isDFormAccessible";
import { DformFileService } from "../data/services/dformFileService";

type DFormContextValue = {
  dformId?: number;
  dformFileService: DformFileService;
  accessType: DformAccessTypes;
  isAccessible: boolean;
};

const defaultValue: DFormContextValue = {
  accessType: DformAccessTypes.HardLock,
  isAccessible: false,
  dformFileService: new DformFileService("/api"),
};

const dformContext = createContext(defaultValue);

let memberDFormFileService: DformFileService;
let managerDFormFileService: DformFileService;
const getDFormFileService = (isMemberView: boolean): DformFileService => {
  if (isMemberView) {
    if (!memberDFormFileService) {
      memberDFormFileService = new DformFileService("/member-view-api");
    }
    return memberDFormFileService;
  }

  if (!managerDFormFileService) {
    managerDFormFileService = new DformFileService("/api");
  }
  return managerDFormFileService;
};

type Props = {
  dformId?: number;
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

const useDFormContext = () => useContext(dformContext);

export const DFormContext = { Provider, Consumer: dformContext.Consumer, useContext: useDFormContext };
