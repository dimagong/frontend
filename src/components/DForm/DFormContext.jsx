import React, { createContext, useContext } from "react";

import { isManagerViewDFormAccessible, isMemberViewDFormAccessible } from "./types/accessTypes";

const DFormContext = createContext();

export const useDFormContext = () => useContext(DFormContext);

export const DFormContextProvider = (props) => {
  const { dFormId = null, accessType, isConfigurable, isMemberView = false, children } = props;

  const isAccessible = (isMemberView ? isMemberViewDFormAccessible : isManagerViewDFormAccessible)(accessType);

  return (
    <DFormContext.Provider value={{ dFormId, accessType, isConfigurable, isMemberView, isAccessible }}>
      {children}
    </DFormContext.Provider>
  );
};
