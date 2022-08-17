import React, { createContext, useContext } from "react";

const DFormContext = createContext();

export const useDFormContext = () => useContext(DFormContext);

export const DFormContextProvider = ({ dFormId = null, isConfigurable, isMemberView = false, children }) => {
  return <DFormContext.Provider value={{ dFormId, isConfigurable, isMemberView }}>{children}</DFormContext.Provider>;
};
