import React from "react";
import { Form } from "antd";

import { NmpLongText } from "./NmpLongText";

export default {
  title: "Nmp/LongText",
  component: NmpLongText,
};

const Template = (props) => {
  return (
    <Form initialValues={{ text: props.value }}>
      <Form.Item name="text">
        <NmpLongText {...props} value={undefined} />
      </Form.Item>
    </Form>
  );
};

export const Base = Template.bind({});
Base.args = {
  value: "<b>Bold</b>",
};
