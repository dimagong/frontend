import { FIELD_TYPES } from "components/DForm/constants";

export const EFFECTS = {
  hidden: "hidden",
  shown: "shown",
  disabled: "disabled",
  active: "active",
};

export const EFFECT_ELEMENT_PROP = {
  [EFFECTS.hidden]: {
    propName: "isHidden",
    value: true,
  },
  [EFFECTS.shown]: {
    propName: "isHidden",
    value: false,
  },
  [EFFECTS.disabled]: {
    propName: "isDisabled",
    value: true,
  },
  [EFFECTS.active]: {
    propName: "isDisabled",
    value: false,
  },
};

export const EFFECT_LABELS = {
  [EFFECTS.hidden]: "hidden if",
  [EFFECTS.shown]: "shown if",
  [EFFECTS.disabled]: "disabled if",
  [EFFECTS.active]: "active if",
};

const OPERATOR_TYPES = {
  exact: "exact",
  exist: "exist",
  bigger: "bigger",
  smaller: "smaller",
};

export const OPERATORS_TEMPLATE = {
  [OPERATOR_TYPES.exact]: {
    name: "equal",
    type: OPERATOR_TYPES.exact,
    title: "Will be",
    expectedValueTitle: "To",
  },
  [OPERATOR_TYPES.exist]: {
    type: OPERATOR_TYPES.exist,
    name: "filled",
    title: "Will be",
  },
  [OPERATOR_TYPES.bigger]: {
    type: OPERATOR_TYPES.bigger,
    name: "bigger",
    title: "Will be",
    expectedValueTitle: "Then",
  },
  [OPERATOR_TYPES.smaller]: {
    type: OPERATOR_TYPES.smaller,
    name: "smaller",
    title: "Will be",
    expectedValueTitle: "Then",
  },
};

export const FIELD_VALUE_PREPARE = {
  [FIELD_TYPES.text]: ({ value }) => value,
  [FIELD_TYPES.date]: ({ value }) => value,
  [FIELD_TYPES.file]: ({ files }) => files,
  [FIELD_TYPES.select]: ({ value }) => value,
  [FIELD_TYPES.number]: ({ value }) => value,
  [FIELD_TYPES.boolean]: ({ value }) => value,
  [FIELD_TYPES.longText]: ({ value }) => value,
  [FIELD_TYPES.textArea]: ({ value }) => value,
  [FIELD_TYPES.fileList]: ({ files }) => files,
  [FIELD_TYPES.multiSelect]: ({ value }) => value,
};

export const OPERATORS_COMPARE_FUNCTIONS = {
  [OPERATOR_TYPES.exact]: (expectedValue, controlValue) => {
    return expectedValue === controlValue;
  },
  [OPERATOR_TYPES.exist]: (expectedValue, controlValue) => {
    return controlValue !== "" && controlValue !== null && controlValue !== undefined;
  },
  [OPERATOR_TYPES.bigger]: (expectedValue, controlValue) => {
    return controlValue > expectedValue;
  },
  [OPERATOR_TYPES.smaller]: (expectedValue, controlValue) => {
    return controlValue < expectedValue;
  },
};

const { exact, exist, bigger, smaller } = OPERATOR_TYPES;

const generateOperatorTemplate = (conditions, options) => {
  return conditions.map((conditionKey) => {
    return {
      ...OPERATORS_TEMPLATE[conditionKey],
      ...((options && options[conditionKey]) || {}),
    };
  });
};

export const OPERATOR_TEMPLATES_BY_SELECTED_FIELD_TYPE = {
  [FIELD_TYPES.text]: generateOperatorTemplate([exact, exist]),
  [FIELD_TYPES.date]: generateOperatorTemplate([exist, exact, smaller, bigger]),
  [FIELD_TYPES.file]: generateOperatorTemplate([exist], { [exist]: { name: "Uploaded" } }),
  [FIELD_TYPES.select]: generateOperatorTemplate([exact, exist]),
  [FIELD_TYPES.number]: generateOperatorTemplate([exist, exact, smaller, bigger]),
  [FIELD_TYPES.boolean]: generateOperatorTemplate([exist], { [exist]: { name: "Checked" } }),
  [FIELD_TYPES.longText]: generateOperatorTemplate([exact, exist]),
  [FIELD_TYPES.textArea]: generateOperatorTemplate([exact, exist]),
  [FIELD_TYPES.fileList]: generateOperatorTemplate([exist], { [exist]: { name: "At least one uploaded" } }),
  [FIELD_TYPES.multiSelect]: generateOperatorTemplate([exist], { [exist]: { name: "At least one selected" } }),
};

export const INITIAL_CONDITION_DATA = {
  id: null,
  field: null,
  effect: null,
  operator: null,
  expectedValue: null,
};
