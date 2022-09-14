import React from "react";

import { Checkbox } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";

// const onChange = (e: CheckboxChangeEvent) => {
//   console.log(`checked = ${e.target.checked}`);
// };
interface IProps {
  onChange?: (e: CheckboxChangeEvent) => void;
}

const NpmCheckbox = ({ onChange }: IProps) => {
  <Checkbox onChange={onChange}>Checkbox</Checkbox>;
};

export default NpmCheckbox;
