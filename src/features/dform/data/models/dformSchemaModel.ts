import { unexpected } from "features/common";

import { DformBlockTypes } from "./dformBlockModel";
import { DformGroupModel } from "./dformGroupModel";
import { DformElementModel } from "./dformElementModel";
import { DformSectionModel } from "./dformSectionModel";
import type { DformFieldModel } from "./dformFieldModel";
import type { DformBlockModel } from "./dformBlockModel";
import type { DformBlockId, DformFieldValueType, DformGroupId, DformSectionId, InferDformElementId } from "./types";

export class DformSchemaModel {
  constructor(
    public blocks: DformBlockModel[] = [],
    public groups: DformGroupModel[] = [],
    public sections: DformSectionModel[] = [],
    public relatedSectionsIds: DformSectionId[] = []
  ) {}

  get orderedSections(): DformSectionModel[] {
    return this.relatedSectionsIds.map((sectionId) => this.getSectionById(sectionId));
  }

  get fields(): DformFieldModel[] {
    return this.blocks.filter(({ blockType }) => blockType === DformBlockTypes.Field) as DformFieldModel[];
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

  getFieldById(id: DformBlockId): DformFieldModel {
    return this.getElementById(this.fields, id);
  }

  getGroupById(id: DformGroupId): DformGroupModel {
    return this.getElementById(this.groups, id);
  }

  getSectionById(id: DformSectionId): DformSectionModel {
    return this.getElementById(this.sections, id);
  }

  getFieldsBySectionId(sectionId: DformSectionId): DformFieldModel[] {
    const section = this.getSectionById(sectionId);
    const groups = section.relatedGroupsIds.map((groupId) => this.getGroupById(groupId));
    const blocks = groups
      .map(({ relatedBlocksIds }) => relatedBlocksIds.map((blockId) => this.getBlockById(blockId)))
      .flat();
    return blocks.filter(({ blockType }) => blockType === DformBlockTypes.Field) as DformFieldModel[];
  }

  getFieldByMasterSchemaFieldId(masterSchemaFieldId: number): DformFieldModel | undefined {
    return this.fields.find((field) => field.masterSchemaFieldId === masterSchemaFieldId);
  }

  getFieldsIdsBySectionId(sectionId: DformSectionId): DformBlockId[] {
    return this.getFieldsBySectionId(sectionId).map(({ id }) => id);
  }

  getRequiredFieldsBySectionId(sectionId: DformSectionId): DformFieldModel[] {
    return this.getFieldsBySectionId(sectionId).filter(({ isRequired }) => isRequired);
  }

  isFieldValid(field: DformFieldModel, values: Record<number, DformFieldValueType>): boolean {
    const value = values[field.masterSchemaFieldId];

    return field.isValid(value);
  }

  getValidRequiredFieldsBySectionId(sectionId: DformSectionId, values: Record<number, DformFieldValueType>) {
    return this.getRequiredFieldsBySectionId(sectionId).filter((field) => this.isFieldValid(field, values));
  }
}
