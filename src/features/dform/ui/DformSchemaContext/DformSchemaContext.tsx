import type { FC, ReactNode } from "react";
import React, { createContext, useContext, useMemo } from "react";

import {
  DformSectionId,
  DformBlockModel,
  DformGroupModel,
  DformSchemaModel,
  DformSectionModel,
} from "../../data/models";

export type DformSchemaContextValue = {
  dformSchema: InstanceType<typeof DformSchemaModel>;
};

const context = createContext<DformSchemaContextValue>({
  dformSchema: new DformSchemaModel(),
});

export type DformSchemaContextProviderProps = {
  blocks: DformBlockModel[];
  groups: DformGroupModel[];
  sections: DformSectionModel[];
  relatedSectionsIds: DformSectionId[];

  children: ReactNode;
};

const Provider: FC<DformSchemaContextProviderProps> = (props) => {
  const { blocks, groups, sections, relatedSectionsIds, children } = props;

  const value: DformSchemaContextValue = useMemo(() => {
    return { dformSchema: new DformSchemaModel(blocks, groups, sections, relatedSectionsIds) };
  }, [blocks, groups, sections]);

  return <context.Provider value={value}>{children}</context.Provider>;
};

export const DformSchemaContext = {
  Provider,
  useContext: () => useContext(context),
};
