import { FIELD_TYPES } from "../../../../constants";

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

export const OPERANDS = [
  {
    value: "equal",
    label: "equal to",
  },
  {
    value: "not equal",
    label: "not equal to",
  },
  {
    value: "bigger",
    label: "bigger then",
  },
  {
    value: "smaller",
    label: "smaller then",
  },
];

const CONDITION_TYPES = {
  exact: "exact",
  exist: "exist",
  bigger: "bigger",
  smaller: "smaller",
};

export const CONDITION_FIELD_TEMPLATE = {
  [CONDITION_TYPES.exact]: {
    conditionType: CONDITION_TYPES.exact,
    operandTitle: "Will be",
    operandName: "equal",
    expectedValueTitle: "To",
  },
  [CONDITION_TYPES.exist]: {
    conditionType: CONDITION_TYPES.exist,
    operandTitle: "Will be",
    operandName: "filled",
  },
  [CONDITION_TYPES.bigger]: {
    conditionType: CONDITION_TYPES.bigger,
    operandTitle: "Will be",
    operandName: "bigger",
    expectedValueTitle: "Then",
  },
  [CONDITION_TYPES.smaller]: {
    conditionType: CONDITION_TYPES.smaller,
    operandTitle: "Will be",
    operandName: "smaller",
    expectedValueTitle: "Then",
  },
};

// export const SUPPORTED_FIELD_TYPES = [
//   [FIELD_TYPES.text],
//   [FIELD_TYPES.date],
//   [FIELD_TYPES.file],
//   [FIELD_TYPES.select],
//   [FIELD_TYPES.number],
//   [FIELD_TYPES.boolean],
//   [FIELD_TYPES.longText],
//   [FIELD_TYPES.textArea],
//   [FIELD_TYPES.fileList],
//   [FIELD_TYPES.multiSelect],
// ];

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

export const CONDITIONS_COMPARE_FUNCTIONS = {
  [CONDITION_TYPES.exact]: (expectedValue, controlValue) => {
    return expectedValue === controlValue;
  },
  [CONDITION_TYPES.exist]: (expectedValue, controlValue) => {
    return controlValue !== "" && controlValue !== null && controlValue !== undefined;
  },
  [CONDITION_TYPES.bigger]: (expectedValue, controlValue) => {
    return controlValue > expectedValue;
  },
  [CONDITION_TYPES.smaller]: (expectedValue, controlValue) => {
    return controlValue < expectedValue;
  },
};

const { exact, exist, bigger, smaller } = CONDITION_TYPES;

const generateConditions = (conditions, options) => {
  return conditions.map((conditionKey) => {
    return {
      ...CONDITION_FIELD_TEMPLATE[conditionKey],
      ...((options && options[conditionKey]) || {}),
    };
  });
};

export const CONDITIONS_BY_SELECTED_FIELD_TYPE = {
  [FIELD_TYPES.text]: generateConditions([exact, exist]),
  [FIELD_TYPES.date]: generateConditions([exist, exact, smaller, bigger]),
  [FIELD_TYPES.file]: generateConditions([exist], { [exist]: { operandName: "Uploaded" } }),
  [FIELD_TYPES.select]: generateConditions([exact, exist]),
  [FIELD_TYPES.number]: generateConditions([exist, exact, smaller, bigger]),
  [FIELD_TYPES.boolean]: generateConditions([exist], { [exist]: { operandName: "Checked" } }),
  [FIELD_TYPES.longText]: generateConditions([exact, exist]),
  [FIELD_TYPES.textArea]: generateConditions([exact, exist]),
  [FIELD_TYPES.fileList]: generateConditions([exist], { [exist]: { operandName: "At least one uploaded" } }),
  [FIELD_TYPES.multiSelect]: generateConditions([exist], { [exist]: { operandName: "At least one selected" } }),
};
