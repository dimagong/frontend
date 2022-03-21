import PropTypes from "prop-types";

export const IdType = PropTypes.oneOfType([PropTypes.string, PropTypes.number]);

export const ArrayOfString = PropTypes.arrayOf(PropTypes.string);
