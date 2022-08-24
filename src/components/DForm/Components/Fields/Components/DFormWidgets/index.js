import Text from "./Components/Text";
import FileWidget from "./Components/File";
import FileListWidget from "./Components/FileList";
import TextArea from "./Components/TextArea";
import Select from "./Components/Select";
import LongText from "./Components/LongText";
import CheckboxWidget from "./Components/Boolean";
import NumberWidget from "./Components/Number";
import DateWidget from "./Components/Date";
import MultiSelectWidget from "./Components/MultiSelect";
import HelpText from "./Components/HelpText";

import { FIELD_TYPES } from "components/DForm/constants";

const { text, file, fileList, textArea, select, longText, boolean, number, date, multiSelect, helpText } = FIELD_TYPES;

const dFormWidgets = {
  [text]: Text,
  [file]: FileWidget,
  [fileList]: FileListWidget,
  [textArea]: TextArea,
  [select]: Select,
  [longText]: LongText,
  [boolean]: CheckboxWidget,
  [number]: NumberWidget,
  [date]: DateWidget,
  [multiSelect]: MultiSelectWidget,
  [helpText]: HelpText,
};

export default dFormWidgets;
