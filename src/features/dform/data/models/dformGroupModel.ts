import type { DformGroupId, DformBlockId } from "./types";
import { DformElementModel, DformElementTypes } from "./dformElementModel";

export class DformGroupModel extends DformElementModel<DformGroupId> {
  readonly elementType = DformElementTypes.Group;

  constructor(
    id: DformGroupId,
    conditions: unknown[],
    isProtected: boolean,
    isVisibleNonManagers: boolean,
    public name: string,
    public relatedBlocksIds: DformBlockId[]
  ) {
    super(id, conditions, isProtected, isVisibleNonManagers);
  }
}
