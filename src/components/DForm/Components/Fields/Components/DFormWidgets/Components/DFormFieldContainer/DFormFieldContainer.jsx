import React from "react";
import { Form } from "antd";
import PropTypes from "prop-types";

import { DFormFieldLabel } from "../DFormFieldLabel";

export const DFormFieldContainer = ({ name, label, isRequired, isLabelShowing, className, children }) => {
  return (
    <Form.Item
      name={name}
      label={isLabelShowing ? <DFormFieldLabel label={label} /> : undefined}
      rules={[{ required: isRequired }]}
      className={className}
    >
      {children}
    </Form.Item>
  );
};

DFormFieldContainer.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  isRequired: PropTypes.bool.isRequired,
  isLabelShowing: PropTypes.bool.isRequired,
};
