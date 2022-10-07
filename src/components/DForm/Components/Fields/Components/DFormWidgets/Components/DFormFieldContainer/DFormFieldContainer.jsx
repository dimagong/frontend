import React from "react";
import { Form } from "antd";
import PropTypes from "prop-types";

import { IdType } from "utility/prop-types";

import { DFormFieldLabel } from "../DFormFieldLabel";

export const DFormFieldContainer = ({ id, label, isRequired, isLabelShowing, className, children }) => {
  return (
    <Form.Item
      name={id}
      label={isLabelShowing ? <DFormFieldLabel label={label} isRequired={isRequired} /> : undefined}
      rules={[{ required: isRequired }]}
      className={className}
    >
      {children}
    </Form.Item>
  );
};

DFormFieldContainer.propTypes = {
  id: IdType.isRequired,
  label: PropTypes.string,
  isRequired: PropTypes.bool.isRequired,
  isLabelShowing: PropTypes.bool.isRequired,
};
