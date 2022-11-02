import React from "react";
import type { FC } from "react";

import { DFormElementTypes } from "../types";

type Props = {
  elementId: string;
  elementType: DFormElementTypes;
  isHidden?: boolean;
  isDisabled?: boolean;
};
// ToDo create React context for DForm DCR
export const DCRElement: FC<Props> = (props) => {
  return null;
};
