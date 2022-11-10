import React from "react";
import type { FC, ReactNode } from "react";

import { DFormContext } from "../DFormContext";
import { DformAccessTypes } from "../../types";
import { DformSchemaContext } from "../DformSchemaContext";
import { DformBlockModel, DformGroupModel, DformId, DformSectionId, DformSectionModel } from "../../data/models";

export type DFormMemberProviderProps = {
  blocks: DformBlockModel[];
  groups: DformGroupModel[];
  dformId: DformId;
  sections: DformSectionModel[];
  accessType: DformAccessTypes;
  relatedSectionsIds: DformSectionId[];
  children: ReactNode;
};

export const DFormMemberProvider: FC<DFormMemberProviderProps> = (props) => {
  const { blocks, groups, dformId, sections, accessType, relatedSectionsIds, children } = props;

  return (
    <DFormContext.Provider dformId={dformId} accessType={accessType} isMemberView>
      <DformSchemaContext.Provider
        blocks={blocks}
        groups={groups}
        sections={sections}
        relatedSectionsIds={relatedSectionsIds}
      >
        {children}
      </DformSchemaContext.Provider>
    </DFormContext.Provider>
  );
};
