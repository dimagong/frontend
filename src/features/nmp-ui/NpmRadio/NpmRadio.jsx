import "./styles.scss";

import React from "react";

import { Radio } from "antd";

const NpmRadio = ({ value, text }) => <Radio value={value}>{text}</Radio>;

export default NpmRadio;
