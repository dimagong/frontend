import { unexpected } from "features/common";
import { devError } from "features/common/devWarning";

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
    if (list.length === 0) {
      unexpected(`Can not find dform element by id: "${id}", list is empty.`);
    }

    if (!id) {
      const elementType = list[0].elementType;
      unexpected(`Can not find dform ${elementType}, id is nullable.`);
    }

    const element = list.find((element) => element.id === id);

    if (!element) {
      const elementType = list[0].elementType;
      unexpected(`Can not find dform ${elementType} by id: "${id}"`);
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

  getSectionByGroupId(id: DformGroupId): DformSectionModel {
    const group = this.getGroupById(id);
    return this.sections.find(({ relatedGroupsIds }) => relatedGroupsIds.find((groupId) => groupId === group.id)!)!;
  }

  isFieldProtected(id: DformBlockId): boolean {
    try {
      const field = this.getFieldById(id);
      const group = this.getGroupById(field.groupId);
      const section = this.getSectionByGroupId(group.id);

      const isFieldProtected = field.isProtected && field.isVisibleNonManagers;
      const isGroupProtected = group.isProtected && group.isVisibleNonManagers;
      const isSectionProtected = section.isProtected && section.isVisibleNonManagers;

      return isFieldProtected || isGroupProtected || isSectionProtected;
    } catch (error) {
      devError(error);
      return false;
    }
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

  isFieldValid(field: DformFieldModel, values: Record<DformBlockId, DformFieldValueType>): boolean {
    const value = values[field.id];

    return field.isValid(value);
  }

  getQuantityOfValidFieldInSectionById(
    sectionId: DformSectionId,
    values: Record<DformBlockId, DformFieldValueType>
  ): number {
    const requiredFields = this.getRequiredFieldsBySectionId(sectionId);

    if (requiredFields.length === 0) {
      return 0;
    }

    const validRequiredFields = this.getValidRequiredFieldsBySectionId(sectionId, values);
    const percent = Math.round((validRequiredFields.length / requiredFields.length) * 100);

    return percent;
  }

  getValidRequiredFieldsBySectionId(sectionId: DformSectionId, values: Record<DformBlockId, DformFieldValueType>) {
    return this.getRequiredFieldsBySectionId(sectionId).filter((field) => this.isFieldValid(field, values));
  }
}
