import type { DformBlockId, DformGroupId } from "./types";
import { AbstractDformBlockModel, DformBlockSizeTypes, DformBlockTypes } from "./dformBlockModel";

export class DformHelpTextModel extends AbstractDformBlockModel {
  readonly blockType = DformBlockTypes.HelpText;

  constructor(
    id: DformBlockId,
    groupId: DformGroupId,
    blockSize: DformBlockSizeTypes,
    conditions: unknown[],
    isProtected: boolean,
    isVisibleNonManagers: boolean,
    public helpText: string
  ) {
    super(id, conditions, isProtected, isVisibleNonManagers, groupId, blockSize);
  }
}
