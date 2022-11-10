import type { DformSectionId, DformGroupId } from "./types";
import { DformElementModel, DformElementTypes } from "./dformElementModel";

export class DformSectionModel extends DformElementModel<DformSectionId> {
  readonly elementType = DformElementTypes.Section;

  constructor(
    id: DformSectionId,
    conditions: unknown[],
    isProtected: boolean,
    public name: string,
    public isViewed: boolean,
    public relatedGroupsIds: DformGroupId[]
  ) {
    super(id, conditions, isProtected);
  }
}
