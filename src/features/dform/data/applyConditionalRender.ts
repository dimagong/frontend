import { cloneDeep } from "lodash";

import { checkConditions } from "./checkConditions";

export const applyDynamicConditionalRender = (schema, normalizedValues) => {
  // Do not apply conditions on empty values
  if (Object.keys(normalizedValues).length === 0) return schema;

  const schemaCopy = cloneDeep(schema);

  const { fields, sections, groups } = schemaCopy;

  schemaCopy.fields = checkConditions(fields, normalizedValues, fields);
  schemaCopy.groups = checkConditions(groups, normalizedValues, fields);
  schemaCopy.sections = checkConditions(sections, normalizedValues, fields);

  return schemaCopy;
};
