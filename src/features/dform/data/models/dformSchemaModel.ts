import { unexpected } from "features/common";

import { DformGroupModel } from "./dformGroupModel";
import { DformSectionModel } from "./dformSectionModel";
import type { DformBlockModel } from "./dformBlockModel";
import { DformElementModel, DformElementTypes } from "./dformElementModel";
import type { DformSectionId, DformGroupId, DformBlockId, InferDformElementId } from "./types";

export class DformSchemaModel {
  constructor(
    public blocks: DformBlockModel[] = [],
    public groups: DformGroupModel[] = [],
    public sections: DformSectionModel[] = [],
    public relatedSectionsIds: DformSectionId[] = []
  ) {}

  private getElementListByType(type: DformElementTypes) {
    switch (type) {
      case DformElementTypes.Block:
        return this.blocks;
      case DformElementTypes.Group:
        return this.groups;
      case DformElementTypes.Section:
        return this.sections;
    }
  }

  private getElementById<T extends DformElementModel<unknown>>(list: T[], id: InferDformElementId<T>) {
    const element = list.find((element) => element.id === id);

    if (!element) {
      unexpected(`Can not find dform element by id: "${id}"`);
    }

    return element;
  }

  getBlockById(id: DformBlockId): DformBlockModel {
    return this.getElementById(this.blocks, id);
  }

  getGroupById(id: DformGroupId): DformGroupModel {
    return this.getElementById(this.groups, id);
  }

  getSectionById(id: DformSectionId): DformSectionModel {
    return this.getElementById(this.sections, id);
  }
}
