import Text from "./Components/Text";
import File from "./Components/File";
import TextArea from "./Components/TextArea";
import Select from "./Components/Select";
import LongText from "./Components/LongText";
import CheckboxWidget from "./Components/Boolean";
import NumberWidget from "./Components/Number";
import DateWidget from "./Components/Date";
import MultiSelectWidget from "./Components/MultiSelect";
import HelpText from "./Components/HelpText";

import { FIELD_TYPES } from "features/Applications/constants";

const { text, file, textArea, select, longText, boolean, number, date, multiSelect, helpText } = FIELD_TYPES;

const dFormWidgets = {
  [text]: Text,
  [file]: File,
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
