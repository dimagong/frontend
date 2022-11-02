import type { FC, ReactNode } from "react";
import React, { useContext, createContext } from "react";

import { DFormSchema as ServerDFormSchema } from "../../types/dformSchema";
import type { DFormBlockType, DFormSchemaType } from "../../types";

interface DFormSchemaContext {
  getBlockById: (blockId: string) => DFormBlockType;
}

const contextValue: DFormSchemaContext = {
  getBlockById: (blockId: string) => ({} as DFormBlockType),
};

const Context = createContext(contextValue);

export const useDFormSchema = () => useContext(Context);

type Props = {
  dformSchema: ServerDFormSchema;
  children: ReactNode;
};

export const DFormSchemaProvider: FC<Props> = (props) => {
  const { dformSchema, children } = props;

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
