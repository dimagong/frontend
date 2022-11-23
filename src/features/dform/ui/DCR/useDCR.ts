import { Form } from "antd";
import { DformSchemaContext } from "../DformSchemaContext";
import { getDCREffect } from "./getDCREffect";

export const useDCREffect = (conditions: unknown[]) => {
  const form = Form.useFormInstance();
  const { dformSchema } = DformSchemaContext.useContext();

  const effect = getDCREffect({
    conditions,
    getFieldById: (id) => dformSchema.getFieldById(id),
    getFieldValue: (id) => form.getFieldValue(id),
  });

  return effect;
};
