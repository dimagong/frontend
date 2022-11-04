import type { FC, ReactNode } from "react";
import React, { createContext, useContext, useMemo } from "react";

import { DFormAccessTypes } from "./types";
import { DformFileService } from "./data/dformFileService";
import { isMemberDFormAccessible } from "./data/isMemberDFormAccessible";
import { isManagerDFormAccessible } from "./data/isManagerDFormAccessible";

type ContextValue = {
  dformId?: number;
  dformFileService?: DformFileService;
  accessType: DFormAccessTypes;
  isAccessible: boolean;
  isConfigurable: boolean;
};

const defaultValue: ContextValue = {
  accessType: DFormAccessTypes.HardLock,
  isConfigurable: false,
  isAccessible: false,
};

const DFormContext = createContext(defaultValue);

export const useDFormContext = () => useContext(DFormContext);

type Props = {
  id?: number;
  accessType?: DFormAccessTypes;
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
    : (isMemberView ? isMemberDFormAccessible : isManagerDFormAccessible)(accessType);

  const dformFileService = useMemo(() => {
    return isMemberView ? DformFileService.member : DformFileService.manager;
  }, [isMemberView]);

  const value: ContextValue = { dformId, dformFileService, accessType, isConfigurable, isAccessible };

  return <DFormContext.Provider value={value} children={children} />;
};
