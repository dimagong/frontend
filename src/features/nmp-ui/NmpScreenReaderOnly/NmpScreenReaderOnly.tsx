import "./styles.scss";

import React from "react";
import classnames from "classnames";
import type { FC, ReactNode, HTMLAttributes, CSSProperties } from "react";

type Props = HTMLAttributes<Element> & {
  tag?: keyof JSX.IntrinsicElements;
  style?: CSSProperties;
  className?: string;
  children?: ReactNode;
};

export const NmpScreenReaderOnly: FC<Props> = (props) => {
  const { tag: Tag = "span", style, className, children, ...attrs } = props;

  return (
    <Tag style={style} className={classnames("nmp-sr-only", className)} {...attrs}>
      {children}
    </Tag>
  );
};
