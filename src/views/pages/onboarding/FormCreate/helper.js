import Constants from "./Parts/Constants";

function _toBool(value) {
  switch (typeof value) {
    case 'string' : {
      return value === '1' || value === 'true';
    }
    case 'boolean' : {
      return value;
    }
    case 'number' : {
      return Boolean(value);
    }
    default : {
      console.log('DEFAULT BOOL VALUE');
      return false;
    }
  }
}

export function getEffectByType(type) {
  switch (type) {
    case Constants.EFFECT_DISABLED: {
      return Constants.UI_DISABLED;
    }
    case Constants.EFFECT_HIDDEN: {
      return Constants.UI_HIDDEN;
    }
    default: {
      return Constants.UI_NO_EFFECT;
    }
  }
}

export function getFieldsBySection(state, sectionName) {
  let fields = [];
  for (let fieldInGroup in state.uiSchema.sections) {
    if (state.uiSchema.sections[fieldInGroup] !== sectionName) continue;
    fields.push(fieldInGroup);
  }
  return fields;
}

export function isFieldHasDefaultEffectByOperator(operator) {
  switch (operator) {
    case Constants.DEPENDENCY_LOGIC_OPERATOR_EQUAL : {
      return true;
    }
    case Constants.DEPENDENCY_LOGIC_OPERATOR_NOT_EQUAL : {
      return true;
    }
    default : {
      return false
    }
  }
}
// operator, typeField
export function getFieldHasDefaultEffectByOperator() {
  return false;
  // if(typeField === Constants.FIELD_TYPE_SELECT || typeField === Constants.FIELD_TYPE_MULTI_SELECT) {
  //   switch (operator) {
  //     case Constants.DEPENDENCY_LOGIC_OPERATOR_EQUAL : {
  //       return true;
  //     }
  //     case Constants.DEPENDENCY_LOGIC_OPERATOR_NOT_EQUAL : {
  //       return true;
  //     }
  //     default : {
  //       return false
  //     }
  //   }
  // } else {
  //   switch (operator) {
  //     case Constants.DEPENDENCY_LOGIC_OPERATOR_EQUAL : {
  //       return true;
  //     }
  //     case Constants.DEPENDENCY_LOGIC_OPERATOR_NOT_EQUAL : {
  //       return true;
  //     }
  //     default : {
  //       return false
  //     }
  //   }
  // }
}

export function operatorResult(property, operator, fieldValue, value, field = null) {
  // todo bug resolved
  const typeField = getSpecificType(property);
  // if (!fieldValue || !value) return getFieldHasDefaultEffectByOperator(operator, typeField);

  switch (operator) {
    case Constants.DEPENDENCY_LOGIC_OPERATOR_EQUAL: {
      if (Array.isArray(fieldValue)) {

        if (fieldValue.some(nextFieldValue => nextFieldValue === value)) {
          return true;
        }
        return false;
      }

      if (typeField === Constants.FIELD_TYPE_NUMBER) {
        if (parseFloat(fieldValue) === parseFloat(value)) {
          return true;
        }
        return false;
      }

      if (typeField === Constants.FIELD_TYPE_BOOLEAN) {
        // temporary fix ( need update condition template by type of choosed fileds )
        if (_toBool(fieldValue) === _toBool(value)) {
          return true;
        }
        return false;
      }

      if (fieldValue === value) {
        return true;
      }

      return false;
    }
    case Constants.DEPENDENCY_LOGIC_OPERATOR_NOT_EQUAL: {

      if (Array.isArray(fieldValue)) {
        if (fieldValue.some(nextFieldValue => nextFieldValue === value)) {
          return false;
        }
        return true;
      }

      if (typeField === Constants.FIELD_TYPE_BOOLEAN) {

        if (_toBool(fieldValue) !== _toBool(value)) {
          return true;
        }
        return false;
      }

      if (typeField === Constants.FIELD_TYPE_NUMBER) {
        if (parseFloat(fieldValue) !== parseFloat(value)) {
          return true;
        }
        return false;
      }

      if (fieldValue !== value) {
        return true;
      }

      return false;
    }
    case Constants.DEPENDENCY_LOGIC_OPERATOR_MORE: {

      if (Array.isArray(fieldValue)) {
        if (fieldValue.some(nextFieldValue => nextFieldValue > value)) {
          return true;
        }

        return false;
      }
      if (typeField === Constants.FIELD_TYPE_NUMBER) {
        if (parseFloat(fieldValue) > parseFloat(value)) {
          return true;
        }
        return false;
      }

      if (fieldValue.length > value) {
        return true;
      }

      return false;
    }
    case Constants.DEPENDENCY_LOGIC_OPERATOR_LESS: {

      if (Array.isArray(fieldValue)) {
        if (fieldValue.some(nextFieldValue => nextFieldValue < value)) {
          return true;
        }

        return false;
      }
      if (typeField === Constants.FIELD_TYPE_NUMBER) {
        if (parseFloat(fieldValue) < parseFloat(value)) {
          return true;
        }
        return false;
      }
      if (fieldValue.length < value) {
        return true;
      }

      return false;
    }
    default: {
      return false
    }
  }
}

export function isValidationFieldPassed(state, field) {

  if (!(field in state.formData) && 'minLength' in state.schema.properties[field] && state.schema.properties[field]['minLength'] > 0) {
    return false;
  }

  if ('minLength' in state.schema.properties[field] && state.formData[field].length < state.schema.properties[field]['minLength']) {
    return false;
  }

  if ('maxLength' in state.schema.properties[field] && state.formData[field].length > state.schema.properties[field]['maxLength']) {
    return false;
  }

  return true;
}

export function getFieldsByGroup(state, groupName) {
  let fields = [];
  for (let fieldInGroup in state.uiSchema.groups) {
    if (state.uiSchema.groups[fieldInGroup] !== groupName) continue;
    fields.push(fieldInGroup);
  }
  return fields;
}

export function getSpecificType(property) {
  if (
    property.type === Constants.RJSF_FIELD_TYPE_STRING && 'format' in property &&
    (property.format === 'date' || property.format === 'date-time')
  ) {
    return Constants.FIELD_TYPE_DATE;
  } else if (property.type === Constants.RJSF_FIELD_TYPE_STRING && 'enum' in property) {
    return Constants.FIELD_TYPE_SELECT;
  } else if (
    property.type === Constants.RJSF_FIELD_TYPE_ARRAY && 'items' in property &&
    'format' in property.items &&
    (property.items.format === 'data-url' || property.items.format === 'file')
  ) {
    return Constants.FIELD_TYPE_FILE_LIST;
  } else if (property.type === Constants.RJSF_FIELD_TYPE_ARRAY && 'items' in property) {
    return Constants.FIELD_TYPE_MULTI_SELECT;
  } else if (
    property.type === Constants.RJSF_FIELD_TYPE_STRING && 'format' in property &&
    property.format === 'textarea') {
    return Constants.FIELD_TYPE_TEXT_AREA;
  } else if (
    property.type === Constants.RJSF_FIELD_TYPE_STRING && 'format' in property &&
    (property.format === 'data-url' || property.format === 'file')
  ) {
    return Constants.FIELD_TYPE_FILE;
  } else if (property.type === Constants.RJSF_FIELD_TYPE_STRING) {
    return Constants.FIELD_TYPE_TEXT;
  } else if (property.type === Constants.RJSF_FIELD_TYPE_NUMBER) {
    return Constants.FIELD_TYPE_NUMBER;
  } else if (property.type === Constants.RJSF_FIELD_TYPE_BOOLEAN) {
    return Constants.FIELD_TYPE_BOOLEAN;
  }
}

export function getDefaultValueByType(type) {
  switch (type) {
    case Constants.RJSF_FIELD_TYPE_STRING: {
      return '';
    }
    case Constants.RJSF_FIELD_TYPE_INTEGER: {
      return 0;
    }
    case Constants.RJSF_FIELD_TYPE_NUMBER: {
      return 0;
    }
    case Constants.RJSF_FIELD_TYPE_BOOLEAN: {
      return false;
    }
    default: {
      return null
    }
  }
}

export function isElementProtected(state, dependencyType, objKey) {
  return state.additionalData.protected_properties[dependencyType].indexOf(objKey) !== -1;
}
