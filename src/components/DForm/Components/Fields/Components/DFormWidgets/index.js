import Text from "./Components/Text";
import TextArea from "./Components/TextArea";
import Select from "./Components/Select";
import LongText from "./Components/LongText";
import CheckboxWidget from "./Components/Boolean";
import NumberWidget from "./Components/Number";
import DateWidget from "./Components/Date";
import MultiSelectWidget from "./Components/MultiSelect";

import { FIELD_TYPES } from "features/Applications/constants";

const { text, textArea, select, longText, boolean, number, date, multiSelect } = FIELD_TYPES;

export default {
  [text]: Text,
  [textArea]: TextArea,
  [select]: Select,
  [longText]: LongText,
  [boolean]: CheckboxWidget,
  [number]: NumberWidget,
  [date]: DateWidget,
  [multiSelect]: MultiSelectWidget,
};
