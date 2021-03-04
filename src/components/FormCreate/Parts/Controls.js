import Constants from "./Constants";

export const referenceObject = {
  field_id: null,
  value_id: null,
};

export default {
  default: {
    type: "string",
    title: "Some Title",
    default: '',
    reference: {...referenceObject}
  },
  text: {
    type: "string",
    title: "Some Title",
    default: '',
    reference: {...referenceObject}
  },
  reference: {
    type: Constants.FIELD_TYPE_REFERENCE,
    title: "Reference",
    field_id: null,
    value_id: null,
    default: '',
    reference: {...referenceObject}
  },
  textarea: {
    type: "string",
    format: 'textarea',
    title: "Some Title",
    default: '',
    reference: {...referenceObject}
  },
  boolean: {
    type: "boolean",
    title: "Some Title",
    reference: {...referenceObject}
  },
  fileList: {
    type: "array",
    title: "A list of files",
    items: {
      type: "string",
      format: "data-url"
    },
    reference: {...referenceObject}
  },
  [Constants.FIELD_TYPE_HELP_TEXT]: {
    title: "",
    description: "help text",
    type: Constants.RJSF_FIELD_TYPE_HELP_TEXT,
    reference: {...referenceObject}
  },
  number: {
    type: "number",
    title: "Some Title",
    default: '',
    reference: {...referenceObject}
  },
  file: {
    title: "Some Title",
    type: "string",
    format: "data-url",
    reference: {...referenceObject}
  },
  date: {
    type: "string",
    format: "date-time",
    reference: {...referenceObject}
  },
  select: {
    "type": "string",
    "title": "Enum",
    "enum": [
      "test1",
      "test2"
    ],
    reference: {...referenceObject}
  },
  multiSelect: {
    "type": "array",
    "uniqueItems": true,
    "items": {
      "title": "Color",
      "type": "string",
      "anyOf": [
        {
          "type": "string",
          "enum": [
            "value1"
          ],
          "title": "key1"
        },
        {
          "type": "string",
          "enum": [
            "value2"
          ],
          "title": "key2"
        }
      ]
    },
    reference: {...referenceObject}
  }
};
