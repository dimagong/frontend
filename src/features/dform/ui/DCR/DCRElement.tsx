import { Form } from "antd";
import React, { useMemo } from "react";
import type { FunctionComponent, ReactNode, ReactElement } from "react";

import { invariant } from "features/common";

import { DCREffect, getDCREffect } from "./getDCREffect";
import { DformSchemaContext } from "../DformSchemaContext";

interface FC<P> extends FunctionComponent<P> {
  (props: P, context?: any): ReactElement;
}

export type DCRElementProps = {
  conditions: unknown[];
  isHiddenRendered?: boolean;
  children?: (dcrEffect: DCREffect) => ReactNode;
};

export const DCRElement: FC<DCRElementProps> = (props) => {
  const { conditions = [], isHiddenRendered = true, children } = props;

  invariant(children, "Can not reach a children in the props.");

  const form = Form.useFormInstance();
  // const values = form.getFieldsValue();
  const { dformSchema } = DformSchemaContext.useContext();

  const effect = useMemo(
    () =>
      getDCREffect({
        conditions,
        getFieldById: (id) => dformSchema.getFieldById(id),
        getFieldValue: (id) => form.getFieldValue(id),
      }),
    [conditions]
  );

  if (effect.isHidden && isHiddenRendered) {
    return null;
  }

  return children(effect);
};
