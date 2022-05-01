import Constants from "./constants";
import { isEmpty } from "lodash";

export const elementsByGroups = ({ schema, propertiesKeys, groupedFieldsKeys }) => {
  const groups = {};

  propertiesKeys.forEach((elementKey) => {
    if (groupedFieldsKeys.indexOf(elementKey) !== -1) {
      const groupName = schema.uiSchema.groups[elementKey];
      if (isEmpty(groups[groupName])) {
        groups[groupName] = {};
      }

      groups[groupName][elementKey] = schema.schemaproperties[elementKey];
    } else {
      if (isEmpty(groups[Constants.WITHOUT_GROUP + elementKey])) {
        groups[Constants.WITHOUT_GROUP + elementKey] = {};
      }

      groups[Constants.WITHOUT_GROUP + elementKey][elementKey] = schema.schema.properties[elementKey];
    }
  });

  return groups;
};
