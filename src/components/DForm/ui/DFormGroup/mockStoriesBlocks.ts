import { DFormBlockSizeTypes, DFormBlockTypes, DFormFieldTypes } from "../../types";

export const MockStoriesBlocks = [
  {
    blockId: "0",
    helpText: "<h2>Help text block</h2>",
    blockType: DFormBlockTypes.HelpText,
    blockSize: DFormBlockSizeTypes.Full,
  },
  {
    label: "Resource block",
    blockId: "1",
    blockType: DFormBlockTypes.Resource,
    blockSize: DFormBlockSizeTypes.Half,
    isDisabled: false,
    isLabelShowing: true,
    masterSchemaFieldId: 0,
  },
  {
    label: "Text field",
    blockId: "2",
    blockType: DFormBlockTypes.Field,
    fieldType: DFormFieldTypes.Text,
    blockSize: DFormBlockSizeTypes.Half,
    isRequired: true,
    isDisabled: false,
    isLabelShowing: true,
    masterSchemaFieldId: 1,
  },
];
