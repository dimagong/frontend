import type { DformFieldModel } from "./dformFieldModel";
import type { DformBlockId, DformGroupId } from "./types";
import { DformHelpTextModel } from "./dformHelpTextModel";
import { DformElementModel, DformElementTypes } from "./dformElementModel";

export enum DformBlockTypes {
  Field = "field",
  HelpText = "helpText",
}

export enum DformBlockSizeTypes {
  // Currently we need to support that types.
  Half = "col-md-6",
  Full = "col-md-12",
}

export type DformBlockModel = DformHelpTextModel | DformFieldModel;

export abstract class AbstractDformBlockModel extends DformElementModel<DformBlockId> {
  readonly elementType = DformElementTypes.Block;
  abstract readonly blockType: DformBlockTypes;

  constructor(
    id: DformBlockId,
    conditions: unknown[],
    isProtected: boolean,
    isVisibleNonManagers: boolean,
    readonly groupId: DformGroupId,
    public blockSize: DformBlockSizeTypes = DformBlockSizeTypes.Full
  ) {
    super(id, conditions, isProtected, isVisibleNonManagers);
  }
}
