import Text from "./Components/Text";
import TextArea from "./Components/TextArea";
import Select from "./Components/Select";

import { FIELD_TYPES } from "features/Applications/constants";

const { text, textArea, select } = FIELD_TYPES;

export default {
  [text]: Text,
  [textArea]: TextArea,
  [select]: Select,
};
