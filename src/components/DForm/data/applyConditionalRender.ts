import { cloneDeep } from "lodash";

import { DFormSchema } from "../types/dformSchema";
import { NormalizedDFormValues } from "../types/normalizedDFormValues";

import { checkConditions } from "./checkConditions";

export const applyDynamicConditionalRender = (schema: DFormSchema, values: NormalizedDFormValues): DFormSchema => {
  // Do not apply conditions on empty values
  if (Object.keys(values).length === 0) return schema;

  const schemaCopy = cloneDeep(schema);

  const { fields, sections, groups } = schemaCopy;

  // schemaCopy.fields = checkConditions(fields, values, fields);
  // schemaCopy.groups = checkConditions(groups, values, fields);
  // schemaCopy.sections = checkConditions(sections, values, fields);

  return schemaCopy;
};
