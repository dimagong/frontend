import Text from "./Components/Text";
import TextArea from "./Components/TextArea";
import Select from "./Components/Select";
import LongText from "./Components/LongText";
import CheckboxWidget from "./Components/Boolean";

import { FIELD_TYPES } from "features/Applications/constants";

const { text, textArea, select, longText, boolean } = FIELD_TYPES;

export default {
  [text]: Text,
  [textArea]: TextArea,
  [select]: Select,
  [longText]: LongText,
  [boolean]: CheckboxWidget,
};
