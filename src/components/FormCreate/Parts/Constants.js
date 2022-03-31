export const WITHOUT_GROUP = 'WITHOUT_GROUP_';

export const EFFECT_DISABLED = 'disabled',
  EFFECT_HIDDEN = 'hidden';

export const UI_HIDDEN = 'ui:hidden',
  UI_DISABLED = 'ui:disabled',
  UI_NO_EFFECT = 'ui:no-effect',
  UI_OPTIONS = 'ui:options';

export const DEPENDENCY_LOGIC_OPERATOR_EQUAL = '=',
  DEPENDENCY_LOGIC_OPERATOR_MORE = '>',
  DEPENDENCY_LOGIC_OPERATOR_LESS = '<',
  DEPENDENCY_LOGIC_OPERATOR_NOT_EQUAL = '!=';

export const DEPENDENCY_LOGIC_OPERATOR_ARR = [
  DEPENDENCY_LOGIC_OPERATOR_EQUAL,
  DEPENDENCY_LOGIC_OPERATOR_MORE,
  DEPENDENCY_LOGIC_OPERATOR_LESS,
  DEPENDENCY_LOGIC_OPERATOR_NOT_EQUAL
];

export const FIELD_TYPE_TEXT = 'text',
  FIELD_TYPE_REFERENCE = 'reference',
  FIELD_TYPE_TEXT_AREA = 'textarea',
  FIELD_TYPE_LONG_TEXT_AREA = 'longText',
  FIELD_TYPE_NUMBER = 'number',
  FIELD_TYPE_BOOLEAN = 'boolean',
  FIELD_TYPE_DATE = 'date',
  FIELD_TYPE_SELECT = 'select',
  FIELD_TYPE_MULTI_SELECT = 'multiSelect',
  FIELD_TYPE_FILE = 'file',
  FIELD_TYPE_FILE_LIST = 'fileList',
  FIELD_TYPE_RESOURCE = 'resource',
  FIELD_TYPE_HELP_TEXT = 'helpText';

export const FIELD_TYPES = [
  // FIELD_TYPE_REFERENCE,
  FIELD_TYPE_TEXT,
  FIELD_TYPE_TEXT_AREA,
  FIELD_TYPE_LONG_TEXT_AREA,
  FIELD_TYPE_NUMBER,
  FIELD_TYPE_BOOLEAN,
  FIELD_TYPE_DATE,
  FIELD_TYPE_SELECT,
  FIELD_TYPE_MULTI_SELECT,
  FIELD_TYPE_FILE,
  FIELD_TYPE_FILE_LIST,
  FIELD_TYPE_HELP_TEXT,
  FIELD_TYPE_RESOURCE,
];

export const RJSF_FIELD_TYPE_STRING = 'string',
  RJSF_FIELD_TYPE_NUMBER = 'number',
  RJSF_FIELD_TYPE_BOOLEAN = 'boolean',
  RJSF_FIELD_TYPE_INTEGER = 'integer',
  RJSF_FIELD_TYPE_ARRAY = 'array',
  RJSF_FIELD_TYPE_HELP_TEXT = 'helpText',
  RJSF_FIELD_TYPE_REFERENCE = 'reference',
  RJSF_FIELD_TYPE_RESOURCE = 'resource';

export const UI_SCHEMA_PROPERTY_EDIT = {};

export const NOT_MASTER_SCHEMA_FIELDS = [
  FIELD_TYPE_HELP_TEXT
];

export default {
  NOT_MASTER_SCHEMA_FIELDS,

  UI_SCHEMA_PROPERTY_EDIT,

  FIELD_TYPES,
  FIELD_TYPE_REFERENCE,
  FIELD_TYPE_TEXT,
  FIELD_TYPE_TEXT_AREA,
  FIELD_TYPE_LONG_TEXT_AREA,
  FIELD_TYPE_NUMBER,
  FIELD_TYPE_BOOLEAN,
  FIELD_TYPE_DATE,
  FIELD_TYPE_SELECT,
  FIELD_TYPE_MULTI_SELECT,
  FIELD_TYPE_FILE,
  FIELD_TYPE_RESOURCE,
  FIELD_TYPE_FILE_LIST,
  FIELD_TYPE_HELP_TEXT,

  RJSF_FIELD_TYPE_REFERENCE,
  RJSF_FIELD_TYPE_STRING,
  RJSF_FIELD_TYPE_HELP_TEXT,
  RJSF_FIELD_TYPE_RESOURCE,
  RJSF_FIELD_TYPE_NUMBER,
  RJSF_FIELD_TYPE_BOOLEAN,
  RJSF_FIELD_TYPE_INTEGER,
  RJSF_FIELD_TYPE_ARRAY,

  DEPENDENCY_LOGIC_OPERATOR_ARR,
  DEPENDENCY_LOGIC_OPERATOR_EQUAL,
  DEPENDENCY_LOGIC_OPERATOR_MORE,
  DEPENDENCY_LOGIC_OPERATOR_LESS,
  DEPENDENCY_LOGIC_OPERATOR_NOT_EQUAL,

  UI_HIDDEN,
  UI_OPTIONS,
  UI_NO_EFFECT,
  UI_DISABLED,

  WITHOUT_GROUP,

  EFFECT_HIDDEN,
  EFFECT_DISABLED
}
