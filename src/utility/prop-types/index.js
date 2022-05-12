import PropTypes from "prop-types";

export const IdType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

export const ArrayOfStringType = PropTypes.arrayOf(PropTypes.string);

export const OptionType = PropTypes.shape({ label: PropTypes.string.isRequired, value: PropTypes.any });

export const OptionsType = PropTypes.arrayOf(OptionType);
