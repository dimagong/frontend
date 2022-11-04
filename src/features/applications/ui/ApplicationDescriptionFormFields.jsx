import React from "react";
import { Form } from "antd";

import { NmpCheckbox, NmpInput, NmpSelect } from "features/nmp-ui";
import { getCategoriesAsOptions } from "features/home/ContextSearch/Applications/utils/getCategoryAsOption";

import { DFormLabel } from "features/dform/ui/DFormLabel";

export const ApplicationDescriptionFormFields = ({ categories }) => {
  const categoriesOptions = categories ? getCategoriesAsOptions(categories) : null;

  return (
    <>
      <Form.Item label="Name" name="name" className="dform-field mb-2" rules={[{ required: true }]}>
        <NmpInput id="name" type="text" placeholder="Enter application name" />
      </Form.Item>

      <Form.Item label="Description" name="description" className="dform-field mb-2" rules={[{ required: true }]}>
        <NmpInput id="description" type="text" placeholder="Enter application description" />
      </Form.Item>

      {categories ? (
        <Form.Item label="Select organization category" name="categoryId" className="dform-field mb-2">
          <NmpSelect id="categoryId" options={categoriesOptions} />
        </Form.Item>
      ) : null}

      <Form.Item name="isPrivate" className="dform-field mb-2" valuePropName="checked">
        <NmpCheckbox id="isPrivate">
          <DFormLabel label="Is private" isSmall />
        </NmpCheckbox>
      </Form.Item>
    </>
  );
};
