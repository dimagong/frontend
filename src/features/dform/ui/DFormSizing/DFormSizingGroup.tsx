import React, { Children } from "react";
import type { FC, ReactNode } from "react";

import { NmpRow } from "features/nmp-ui";

import { DFormSizingBlockContext } from "./DFormSizingBlockContext";

export type DFormSizerGroupProps = {
  children?: ReactNode;
};

export const DFormSizingGroup: FC<DFormSizerGroupProps> = (props) => {
  const { children } = props;
  const arrayChildren = Children.toArray(children);

  return (
    <NmpRow gutter={40}>
      {Children.map(arrayChildren, (child) => (
        <DFormSizingBlockContext.Provider>{child}</DFormSizingBlockContext.Provider>
      ))}
    </NmpRow>
  );
};
