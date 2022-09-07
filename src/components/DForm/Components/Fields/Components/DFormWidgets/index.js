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
import { DFormResourceWidget } from "./Components/DFormResourceWidget";

import { FieldTypes } from "components/DForm/constants";

const dFormWidgets = {
  [FieldTypes.Text]: DFormTextWidget,
  [FieldTypes.Date]: DFormDateWidget,
  [FieldTypes.File]: DFormFileWidget,
  [FieldTypes.FileList]: DFormFileListWidget,
  [FieldTypes.Select]: DFormSelectWidget,
  [FieldTypes.Number]: DFormNumberWidget,
  [FieldTypes.Boolean]: DFormBooleanWidget,
  [FieldTypes.LongText]: DFormLongTextWidget,
  [FieldTypes.TextArea]: DFormTextAreaWidget,
  [FieldTypes.MultiSelect]: DFormMultiSelectWidget,
  [FieldTypes.HelpText]: DFormHelpTextWidget,
  [FieldTypes.Resource]: DFormResourceWidget,
};

export default dFormWidgets;
