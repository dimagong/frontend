import React from "react";
import type { FC } from "react";

import { DFormBlock } from "../DFormBlock";
import { DFormBaseGroup } from "./DFormBaseGroup";
// import type { DFormBlockType } from "../../types";

type Props = {
  groupId: string;
  groupName: string;
  relatedBlocks: Array<string>;
  // blocks: Array<DFormBlockType>;
};

export const DFormGroup: FC<Props> = (props) => {
  const { groupId, groupName, relatedBlocks } = props;

  return (
    <DFormBaseGroup groupId={groupId} groupName={groupName}>
      {relatedBlocks.map((blockId) => (
        <DFormBlock blockId={blockId} key={blockId} />
      ))}

      {/*<Fields
          data={data}
          groupId={groupId}
          isDisabled={isDisabled}
          selectedElement={selectedElement}
          groupFields={group.relatedFields}
          onFieldCreate={onFieldCreate}
          onElementClick={onElementClick}
        />*/}
    </DFormBaseGroup>
  );
};
