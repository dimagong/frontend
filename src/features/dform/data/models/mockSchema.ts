import {
  DformBooleanFieldModel,
  DformDateFieldModel,
  DformDateFormatTypes,
  DformFileFieldModel,
  DformFileListFieldModel,
  DformLongTextFieldModel,
  DformMultiSelectFieldModel,
  DformMultiSelectUIStyles,
  DformNumberFieldModel,
  DformResourceCompileOptionTypes,
  DformResourceFieldModel,
  DformSelectFieldModel,
  DformTextAreaFieldModel,
  DformTextFieldModel,
} from "./dformFieldModel";
import { DformGroupModel } from "./dformGroupModel";
import { DformSectionModel } from "./dformSectionModel";
import { DformHelpTextModel } from "./dformHelpTextModel";
import { DformBlockId, DformGroupId, DformSectionId } from "./types";
import { DformBlockModel, DformBlockSizeTypes } from "./dformBlockModel";

let blockIndex = 0;
const getMockBlockId = (index?: number) => {
  if (index === undefined) {
    return `-b${blockIndex++}` as DformBlockId;
  }

  return `-b${index}` as DformBlockId;
};
const getMockGroupId = (index: number) => `-g${index}` as DformGroupId;
const getMockSectionId = (index: number) => `-s${index}` as DformSectionId;

const BLOCKS_QUANTITY = 12;
const GROUPS_QUANTITY = 4;
const SECTIONS_QUANTITY = 6;

export const mockSections = Array(SECTIONS_QUANTITY)
  .fill(null)
  .map(
    (_, sectionIndex) =>
      new DformSectionModel(
        getMockSectionId(sectionIndex),
        [],
        false,
        false,
        `Section ${sectionIndex + 1}`,
        false,
        Array(GROUPS_QUANTITY)
          .fill(null)
          .map((_, groupIndex) => getMockGroupId(sectionIndex * GROUPS_QUANTITY + groupIndex))
      )
  );

export const mockGroups = Array(SECTIONS_QUANTITY * GROUPS_QUANTITY)
  .fill(null)
  .map(
    (_, groupIndex) =>
      new DformGroupModel(
        getMockGroupId(groupIndex),
        [],
        false,
        false,
        `Group ${groupIndex + 1}`,
        Array(BLOCKS_QUANTITY)
          .fill(null)
          .map((_, blockIndex) => getMockBlockId(groupIndex * BLOCKS_QUANTITY + blockIndex))
      )
  );

export const mockBlocks = Array(SECTIONS_QUANTITY * GROUPS_QUANTITY)
  .fill(null)
  .map((_, groupIndex) => [
    new DformHelpTextModel(
      getMockBlockId(),
      getMockGroupId(groupIndex),
      DformBlockSizeTypes.Full,
      [],
      false,
      false,
      "<b>Help text block</b>"
    ),
    new DformBooleanFieldModel(
      getMockBlockId(),
      getMockGroupId(groupIndex),
      DformBlockSizeTypes.Full,
      [],
      false,
      false,
      "Boolean field",
      true,
      true,
      0
    ),
    new DformDateFieldModel(
      getMockBlockId(),
      getMockGroupId(groupIndex),
      DformBlockSizeTypes.Full,
      [],
      true,
      true,
      "Date field (isProtected + isVisibleNonManagers",
      true,
      true,
      DformDateFormatTypes.Date,
      1
    ),
    new DformFileFieldModel(
      getMockBlockId(),
      getMockGroupId(groupIndex),
      DformBlockSizeTypes.Full,
      [],
      false,
      false,
      "File field",
      true,
      true,
      2
    ),
    new DformFileListFieldModel(
      getMockBlockId(),
      getMockGroupId(groupIndex),
      DformBlockSizeTypes.Full,
      [],
      false,
      false,
      "FileList field",
      true,
      true,
      3
    ),
    new DformLongTextFieldModel(
      getMockBlockId(),
      getMockGroupId(groupIndex),
      DformBlockSizeTypes.Full,
      [],
      false,
      false,
      "LongText field (min 15)",
      true,
      true,
      15,
      undefined,
      4
    ),
    new DformMultiSelectFieldModel(
      getMockBlockId(),
      getMockGroupId(groupIndex),
      DformBlockSizeTypes.Full,
      [],
      false,
      false,
      "MultiSelect field",
      true,
      true,
      DformMultiSelectUIStyles.None,
      Array(8)
        .fill(null)
        .map((_, index) => `Option ${index}`),
      5
    ),
    new DformNumberFieldModel(
      getMockBlockId(),
      getMockGroupId(groupIndex),
      DformBlockSizeTypes.Full,
      [],
      false,
      false,
      "Number field (max 30)",
      true,
      true,
      undefined,
      30,
      undefined,
      undefined,
      6
    ),
    new DformResourceFieldModel(
      getMockBlockId(),
      getMockGroupId(groupIndex),
      DformBlockSizeTypes.Full,
      [],
      false,
      false,
      "Resource field",
      true,
      true,
      DformResourceCompileOptionTypes.CompileOnOnboardingAssociation,
      0,
      7
    ),
    new DformSelectFieldModel(
      getMockBlockId(),
      getMockGroupId(groupIndex),
      DformBlockSizeTypes.Full,
      [],
      false,
      false,
      "Select field",
      true,
      true,
      Array(8)
        .fill(null)
        .map((_, index) => `Option ${index}`),
      8
    ),
    new DformTextFieldModel(
      getMockBlockId(),
      getMockGroupId(groupIndex),
      DformBlockSizeTypes.Full,
      [],
      false,
      false,
      "Text field (min 10; max 20)",
      true,
      true,
      10,
      20,
      9
    ),
    new DformTextAreaFieldModel(
      getMockBlockId(),
      getMockGroupId(groupIndex),
      DformBlockSizeTypes.Full,
      [],
      false,
      false,
      "TextArea field (min 30; max 100)",
      true,
      true,
      30,
      100,
      10
    ),
  ])
  .flat() as unknown as DformBlockModel[];
