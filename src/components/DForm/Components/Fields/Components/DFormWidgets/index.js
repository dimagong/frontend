import { DFormText } from "./Components/DFormText";
import { DFormFile } from "./Components/DFormFile";
import { DFormBoolean } from "./Components/DFormBoolean";
import { DFormFileList } from "./Components/DFormFileList";
import { DFormDatePicker } from "./Components/DFormDatePicker";
import { DFormLongText } from "./Components/DFormLongText";
import { DFormResource } from "./Components/DFormResource";

import { DFormSelectWidget } from "./Components/DFormSelectWidget";
import { DFormNumberWidget } from "./Components/DFormNumberWidget";
import { DFormTextAreaWidget } from "./Components/DFormTextAreaWidget";
import { DFormMultiSelectWidget } from "./Components/DFormMultiSelectWidget";
import { DFormHelpTextWidget } from "./Components/DFormHelpTextWidget";

import { FieldTypes } from "components/DForm";

const dFormWidgets = {
  [FieldTypes.Boolean]: DFormBoolean,
  [FieldTypes.Date]: DFormDatePicker,
  [FieldTypes.File]: DFormFile,
  [FieldTypes.FileList]: DFormFileList,
  [FieldTypes.LongText]: DFormLongText,
  [FieldTypes.Resource]: DFormResource,
  [FieldTypes.Text]: DFormText,

  [FieldTypes.Select]: DFormSelectWidget,
  [FieldTypes.Number]: DFormNumberWidget,
  [FieldTypes.TextArea]: DFormTextAreaWidget,
  [FieldTypes.MultiSelect]: DFormMultiSelectWidget,
  [FieldTypes.HelpText]: DFormHelpTextWidget,
};

export default dFormWidgets;
