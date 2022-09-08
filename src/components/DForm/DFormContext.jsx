import React, { createContext, useContext } from "react";

const DFormContext = createContext();

export const useDFormContext = () => useContext(DFormContext);

export const DFormContextProvider = (props) => {
  const { dFormId = null, accessType, isConfigurable, isMemberView = false, children } = props;

  return (
    <DFormContext.Provider value={{ dFormId, accessType, isConfigurable, isMemberView }}>
      {children}
    </DFormContext.Provider>
  );
};
