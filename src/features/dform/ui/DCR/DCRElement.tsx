import React from "react";
import type { FunctionComponent, ReactNode, ReactElement } from "react";

import { warning } from "features/common";

interface FC<P> extends FunctionComponent<P> {
  (props: P, context?: any): ReactElement<any, any> | null;
}

type Props = {
  isHidden: boolean;
  isDisabled: boolean;
  children?: () => ReactNode;
};

export const DCRElement: FC<Props> = (props) => {
  const { isHidden, isDisabled, children } = props;

  if (!children) {
    warning("Unreachable: Can not reach a children props.");
    return null;
  }

  return children();
};