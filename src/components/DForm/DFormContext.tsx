import type { FC, ReactNode } from "react";
import React, { createContext, useContext, useMemo } from "react";

import { DformFileService } from "./data/dformFileService";
import { isManagerViewDFormAccessible, isMemberViewDFormAccessible, AccessTypes } from "./types/accessTypes";

type ContextValue = {
  dformId?: number;
  dformFileService?: DformFileService;
  accessType: AccessTypes;
  isAccessible: boolean;
  isConfigurable: boolean;
};

const defaultValue: ContextValue = {
  accessType: AccessTypes.HardLock,
  isConfigurable: false,
  isAccessible: false,
};

const DFormContext = createContext(defaultValue);

export const useDFormContext = () => useContext(DFormContext);

type Props = {
  id?: number;
  accessType?: AccessTypes;
  isMemberView?: boolean;
  isConfigurable?: boolean;
  children: ReactNode;
};

export const DFormContextProvider: FC<Props> = (props) => {
  const {
    id: dformId,
    accessType = defaultValue.accessType,
    isMemberView,
    isConfigurable = defaultValue.isConfigurable,
    children,
  } = props;

  const isAccessible = isConfigurable
    ? false
    : (isMemberView ? isMemberViewDFormAccessible : isManagerViewDFormAccessible)(accessType);

  const dformFileService = useMemo(() => {
    return isMemberView ? DformFileService.member : DformFileService.manager;
  }, [isMemberView]);

  const value: ContextValue = { dformId, dformFileService, accessType, isConfigurable, isAccessible };

  return <DFormContext.Provider value={value} children={children} />;
};
