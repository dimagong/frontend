import { DFormTextWidget } from "./Components/DFormTextWidget";
import { DFormDateWidget } from "./Components/DFormDateWidget";
import { DFormFileWidget } from "./Components/DFormFileWidget";
import { DFormFileListWidget } from "./Components/DFormFileListWidget";
import { DFormSelectWidget } from "./Components/DFormSelectWidget";
import { DFormNumberWidget } from "./Components/DFormNumberWidget";
import { DFormBooleanWidget } from "./Components/DFormBooleanWidget";
import { DFormLongTextWidget } from "./Components/DFormLongTextWidget";
import { DFormTextAreaWidget } from "./Components/DFormTextAreaWidget";
import { DFormMultiSelectWidget } from "./Components/DFormMultiSelectWidget";
import { DFormHelpTextWidget } from "./Components/DFormHelpTextWidget";

import { FIELD_TYPES } from "components/DForm/constants";

const { text, file, fileList, textArea, select, longText, boolean, number, date, multiSelect, helpText } = FIELD_TYPES;

const dFormWidgets = {
  [text]: DFormTextWidget,
  [date]: DFormDateWidget,
  [file]: DFormFileWidget,
  [fileList]: DFormFileListWidget,
  [select]: DFormSelectWidget,
  [number]: DFormNumberWidget,
  [boolean]: DFormBooleanWidget,
  [longText]: DFormLongTextWidget,
  [textArea]: DFormTextAreaWidget,
  [multiSelect]: DFormMultiSelectWidget,
  [helpText]: DFormHelpTextWidget,
};

export default dFormWidgets;
