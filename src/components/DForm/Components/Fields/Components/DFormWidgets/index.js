import { DFormBoolean } from "./Components/DFormBoolean";
import { DFormDatePicker } from "./Components/DFormDatePicker";
import { DFormFile } from "./Components/DFormFile";
import { DFormFileList } from "./Components/DFormFileList";
import { DFormHelpText } from "./Components/DFormHelpText";
import { DFormLongText } from "./Components/DFormLongText";
import { DFormNumber } from "./Components/DFormNumber";
import { DFormResource } from "./Components/DFormResource";
import { DFormText } from "./Components/DFormText";

import { DFormSelectWidget } from "./Components/DFormSelectWidget";
import { DFormTextAreaWidget } from "./Components/DFormTextAreaWidget";
import { DFormMultiSelectWidget } from "./Components/DFormMultiSelectWidget";

import { FieldTypes } from "components/DForm";

const dFormWidgets = {
  [FieldTypes.Boolean]: DFormBoolean,
  [FieldTypes.Date]: DFormDatePicker,
  [FieldTypes.File]: DFormFile,
  [FieldTypes.FileList]: DFormFileList,
  [FieldTypes.HelpText]: DFormHelpText,
  [FieldTypes.LongText]: DFormLongText,
  [FieldTypes.Number]: DFormNumber,
  [FieldTypes.Resource]: DFormResource,
  [FieldTypes.Text]: DFormText,

  [FieldTypes.Select]: DFormSelectWidget,
  [FieldTypes.TextArea]: DFormTextAreaWidget,
  [FieldTypes.MultiSelect]: DFormMultiSelectWidget,
};

export default dFormWidgets;
