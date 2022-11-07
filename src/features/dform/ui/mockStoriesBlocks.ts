import { DFormBlockSizeTypes, DFormBlockTypes, DFormFieldTypes } from "../types";

export const mockStoriesBlocks = [
  {
    blockId: "0",
    helpText: "<h2>Help text block</h2>",
    blockType: DFormBlockTypes.HelpText,
    blockSize: DFormBlockSizeTypes.Full,
  },
  {
    label: "Text field",
    blockId: "1",
    blockType: DFormBlockTypes.Field,
    fieldType: DFormFieldTypes.Text,
    blockSize: DFormBlockSizeTypes.Half,
    isRequired: true,
    isDisabled: false,
    isLabelShowing: true,
    masterSchemaFieldId: 1,
  },
  {
    label: "File field",
    blockId: "2",
    blockType: DFormBlockTypes.Field,
    fieldType: DFormFieldTypes.File,
    blockSize: DFormBlockSizeTypes.Half,
    isRequired: true,
    isDisabled: false,
    isLabelShowing: true,
    masterSchemaFieldId: 2,
  },
];
