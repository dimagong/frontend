import { FieldTypes } from "components/DForm/constants";

// DCR Effects

export enum DCREffectTypes {
  Shown = "shown",
  Hidden = "hidden",
  Enabled = "enabled",
  Disabled = "disabled",
}

export const DCREffects = [
  DCREffectTypes.Shown,
  DCREffectTypes.Hidden,
  DCREffectTypes.Enabled,
  DCREffectTypes.Disabled,
];

export const DCREffectProps = {
  [DCREffectTypes.Shown]: { isHidden: false },
  [DCREffectTypes.Hidden]: { isHidden: true },
  [DCREffectTypes.Enabled]: { isDisabled: false },
  [DCREffectTypes.Disabled]: { isDisabled: true },
};

export const DCREffectLabels = {
  [DCREffectTypes.Shown]: "shown if",
  [DCREffectTypes.Hidden]: "hidden if",
  [DCREffectTypes.Enabled]: "enabled if",
  [DCREffectTypes.Disabled]: "disabled if",
};

// DCR Operators

export enum DCROperatorTypes {
  Exact = "exact",
  Exist = "exist",
  Bigger = "bigger",
  Smaller = "smaller",
}

export const DCROperatorTemplates = {
  [DCROperatorTypes.Exact]: {
    name: "equal",
    title: "Will be",
    expectedValueTitle: "To",
    type: DCROperatorTypes.Exact,
  },
  [DCROperatorTypes.Exist]: {
    name: "filled",
    title: "Will be",
    type: DCROperatorTypes.Exist,
  },
  [DCROperatorTypes.Bigger]: {
    name: "bigger",
    title: "Will be",
    expectedValueTitle: "Then",
    type: DCROperatorTypes.Bigger,
  },
  [DCROperatorTypes.Smaller]: {
    name: "smaller",
    title: "Will be",
    expectedValueTitle: "Then",
    type: DCROperatorTypes.Smaller,
  },
};

export const DCRFieldTypesSupportedOperators = {
  [FieldTypes.Text]: [DCROperatorTypes.Exact, DCROperatorTypes.Exist],
  [FieldTypes.Date]: [
    DCROperatorTypes.Exact,
    DCROperatorTypes.Exist,
    DCROperatorTypes.Bigger,
    DCROperatorTypes.Smaller,
  ],
  [FieldTypes.Select]: [DCROperatorTypes.Exact, DCROperatorTypes.Exist],
  [FieldTypes.LongText]: [DCROperatorTypes.Exact, DCROperatorTypes.Exist],
  [FieldTypes.TextArea]: [DCROperatorTypes.Exact, DCROperatorTypes.Exist],
  [FieldTypes.Number]: [
    DCROperatorTypes.Exact,
    DCROperatorTypes.Exist,
    DCROperatorTypes.Bigger,
    DCROperatorTypes.Smaller,
  ],
  [FieldTypes.Boolean]: [DCROperatorTypes.Exist],
  [FieldTypes.File]: [DCROperatorTypes.Exist],
  [FieldTypes.FileList]: [DCROperatorTypes.Exist],
  [FieldTypes.MultiSelect]: [DCROperatorTypes.Exist],
};

const generateOperatorTemplate = (fieldType: string, overrides: object = {}) => {
  const operatorTypes = DCRFieldTypesSupportedOperators[fieldType];
  return operatorTypes.map((operatorType) => {
    return {
      ...DCROperatorTemplates[operatorType],
      ...(overrides ? overrides[operatorType] : {}),
    };
  });
};

export const DCRFieldTypesOperatorTemplates = {
  [FieldTypes.Text]: generateOperatorTemplate(FieldTypes.Text),
  // ToDo: check how bigger & smaller should work
  [FieldTypes.Date]: generateOperatorTemplate(FieldTypes.Date),
  [FieldTypes.Select]: generateOperatorTemplate(FieldTypes.Select),
  [FieldTypes.LongText]: generateOperatorTemplate(FieldTypes.LongText),
  [FieldTypes.TextArea]: generateOperatorTemplate(FieldTypes.TextArea),
  [FieldTypes.Number]: generateOperatorTemplate(FieldTypes.Number),
  // ToDo: consider about not exist operator
  [FieldTypes.Boolean]: generateOperatorTemplate(FieldTypes.Boolean, { [DCROperatorTypes.Exist]: { name: "Checked" } }),
  [FieldTypes.File]: generateOperatorTemplate(FieldTypes.File, { [DCROperatorTypes.Exist]: { name: "Uploaded" } }),
  [FieldTypes.FileList]: generateOperatorTemplate(FieldTypes.FileList, {
    [DCROperatorTypes.Exist]: { name: `At least one uploaded` },
  }),
  [FieldTypes.MultiSelect]: generateOperatorTemplate(FieldTypes.MultiSelect, {
    [DCROperatorTypes.Exist]: { name: `At least one selected` },
  }),
};

// ToDo: control that for each type, it should support any type
export const DCROperatorTypesComparotors = {
  [DCROperatorTypes.Exact]: (expectedValue, controlValue) => {
    return expectedValue === controlValue;
  },
  [DCROperatorTypes.Exist]: (expectedValue, controlValue) => {
    return controlValue !== "" && controlValue !== null && controlValue !== undefined;
  },
  [DCROperatorTypes.Bigger]: (expectedValue, controlValue) => {
    return controlValue > expectedValue;
  },
  [DCROperatorTypes.Smaller]: (expectedValue, controlValue) => {
    return controlValue < expectedValue;
  },
};

// ToDo: check the Resource type support
export const DCRFieldValueConvertors = {
  [FieldTypes.Text]: ({ value }) => (typeof value === "string" ? String(value) : null),
  [FieldTypes.Date]: ({ value }) => (typeof value === "string" ? String(value) : null),
  [FieldTypes.Select]: ({ value }) => (typeof value === "string" ? String(value) : null),
  [FieldTypes.LongText]: ({ value }) => (typeof value === "string" ? String(value) : null),
  [FieldTypes.TextArea]: ({ value }) => (typeof value === "string" ? String(value) : null),
  [FieldTypes.Number]: ({ value }) => (typeof value === "number" ? Number(value) : null),
  [FieldTypes.Boolean]: ({ value }) => (typeof value === "boolean" ? Boolean(value) : null),
  [FieldTypes.File]: ({ files }) => (Array.isArray(files) ? Array.from(files) : []),
  [FieldTypes.FileList]: ({ files }) => (Array.isArray(files) ? Array.from(files) : []),
  [FieldTypes.MultiSelect]: ({ value }) => (Array.isArray(value) ? Array.from(value) : []),
};
