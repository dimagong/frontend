import { DFormBoolean } from "./Components/DFormBoolean";
import { DFormDatePicker } from "./Components/DFormDatePicker";
import { DFormFile } from "./Components/DFormFile";
import { DFormFileList } from "./Components/DFormFileList";
import { DFormHelpText } from "./Components/DFormHelpText";
import { DFormLongText } from "./Components/DFormLongText";
import { DFormMultiSelect } from "./Components/DFormMultiSelect";
import { DFormNumber } from "./Components/DFormNumber";
import { DFormResource } from "./Components/DFormResource";
import { DFormSelect } from "./Components/DFormSelect";
import { DFormText } from "./Components/DFormText";

import { DFormTextAreaWidget } from "./Components/DFormTextAreaWidget";

import { FieldTypes } from "components/DForm";

const dFormWidgets = {
  [FieldTypes.Boolean]: DFormBoolean,
  [FieldTypes.Date]: DFormDatePicker,
  [FieldTypes.File]: DFormFile,
  [FieldTypes.FileList]: DFormFileList,
  [FieldTypes.HelpText]: DFormHelpText,
  [FieldTypes.LongText]: DFormLongText,
  [FieldTypes.MultiSelect]: DFormMultiSelect,
  [FieldTypes.Number]: DFormNumber,
  [FieldTypes.Resource]: DFormResource,
  [FieldTypes.Select]: DFormSelect,
  [FieldTypes.Text]: DFormText,

  [FieldTypes.TextArea]: DFormTextAreaWidget,
};

export default dFormWidgets;
