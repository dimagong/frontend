import React, { FC, ReactNode, createContext, useContext } from "react";

import { isManagerViewDFormAccessible, isMemberViewDFormAccessible, AccessTypes } from "./types/accessTypes";

type Context = {
  dformId?: number;
  accessType: AccessTypes;
  isAccessible: boolean;
  isMemberView: boolean;
  isConfigurable: boolean;
};

const defaultValue: Context = {
  accessType: AccessTypes.HardLock,
  isMemberView: false,
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
    id,
    accessType = defaultValue.accessType,
    isMemberView = defaultValue.isMemberView,
    isConfigurable = defaultValue.isConfigurable,
    children,
  } = props;

  const isAccessible = isConfigurable
    ? false
    : (isMemberView ? isMemberViewDFormAccessible : isManagerViewDFormAccessible)(accessType);

  const value: Context = { dformId: id, accessType, isConfigurable, isMemberView, isAccessible };

  return <DFormContext.Provider value={value} children={children} />;
};
