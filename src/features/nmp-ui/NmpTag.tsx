import React from "react";
import { Tag, TagProps } from "antd";

type Props = TagProps;

export const NmpTag: React.FC<Props> = (props) => <Tag {...props} />;
