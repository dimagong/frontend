import React, { useEffect, useState } from "react";
import { Form } from "antd";
import _ from "lodash";

import { NmpModal, NmpSelect } from "features/nmp-ui";
import { useDFormTemplateCategoriesQuery } from "features/home/ContextSearch/Applications/categoryQueries";
import { parseSelectCategory } from "features/home/ContextSearch/Applications/utils/categoryConverter";
import { NmpInput, NmpButton } from "features/nmp-ui";
import {
  getCategoriesAsOptions,
  getCategoryAsOption,
} from "features/home/ContextSearch/Applications/utils/getCategoryAsOption";

import { getOrganizationType } from "constants/organization";

export const EditCategoryModal = ({ isOpen, onCancel, group, onSubmit, submitting }) => {
  const [form] = Form.useForm();
  const [disabled, setDisabled] = useState(true);
  const [categoriesOptions, setCategoriesOptions] = useState();

  useEffect(() => {
    setDisabled(true);

    form.setFieldValue("name", group.name);
  }, [group]);

  let { data: categories } = useDFormTemplateCategoriesQuery({
    organizationId: group.organizationId,
    organizationType: getOrganizationType(group.organizationType),
  });

  useEffect(() => {
    if (categories) {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      categories = categories
        .map((category) => parseSelectCategory(category))
        .filter((category) => category.categoryId !== group.id);

      setCategoriesOptions(getCategoriesAsOptions(categories));

      const newParentCategory = categories.find((category) => group.parentId === category.categoryId);

      form.setFieldValue("parentId", getCategoryAsOption(newParentCategory));
    }
  }, [categories]);

  const stopPropagation = (event) => {
    event.stopPropagation();
  };

  const handleFormChange = () => {
    const fields = form.getFieldsValue();

    const fieldsKeys = Object.keys(fields);

    const normalizedFieldsValue = normalize(fields);

    setDisabled(true);

    fieldsKeys.forEach((key) => {
      if (!_.isEqual(normalizedFieldsValue[key], group[key])) {
        setDisabled(false);
        return;
      }
    });
  };

  const normalize = (object) => {
    _.forOwn(object, (value, key) => {
      if (value?.value) {
        object[key] = value.value;
      }
    });

    return object;
  };

  const onFinish = (submittedObj) => {
    _.forOwn(submittedObj, (value, key) => {
      if (value?.value) {
        submittedObj[key] = value.value;
      }
    });

    onSubmit(submittedObj);
  };

  return (
    <NmpModal visible={isOpen} title={"Edit category"} onCancel={onCancel} footer={null} onClick={stopPropagation}>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
        name="duplicateForm"
        onFieldsChange={handleFormChange}
        onClick={stopPropagation}
      >
        <Form.Item label="Name" name="name" className="dform-field mb-2" rules={[{ required: true }]}>
          <NmpInput id="name" type="text" placeholder="Enter application name" />
        </Form.Item>

        <Form.Item
          label="Select organization category"
          name="parentId"
          className="dform-field mb-2"
          rules={[{ required: true }]}
        >
          <NmpSelect id="parentId" options={categoriesOptions} />
        </Form.Item>

        <Form.Item className="d-flex justify-content-end mb-0">
          <NmpButton className="button-success" type="primary" size="large" htmlType="submit" disabled={disabled}>
            Save
          </NmpButton>
        </Form.Item>
      </Form>
    </NmpModal>
  );
};
