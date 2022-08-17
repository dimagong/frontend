import React, { createContext, useContext } from "react";

const DFormContext = createContext();

export const useDFormContext = () => useContext(DFormContext);

export const DFormContextProvider = ({ dFormId = null, isConfigurable, children }) => {
  return <DFormContext.Provider value={{ dFormId, isConfigurable }}>{children}</DFormContext.Provider>;
};
