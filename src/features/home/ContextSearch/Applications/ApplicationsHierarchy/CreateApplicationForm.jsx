import React, { useEffect, useState } from "react";
import { Form } from "antd";
import _ from "lodash";

import { ApplicationDescriptionFormFields } from "features/applications/ui/ApplicationDescriptionFormFields";
import { useOrganizationsListQuery } from "features/applications/data/applicationQueries";
import { NmpSelect, NmpButton } from "features/nmp-ui";

import { useDFormTemplateCategoriesQuery } from "../categoryQueries";

import { parseSelectCategory } from "../utils/categoryConverter";
import { getCategoriesAsOptions, getCategoryAsOption } from "../utils/getCategoryAsOption";

import { getOrganizationType } from "constants/organization";

const getOrganizationUniqueId = ({ id, type }) => `${type}/${id}`;

const getOrganizationAsOption = (organization) => ({
  value: getOrganizationUniqueId(organization),
  label: organization.name,
});

const getOrganizationByUniqueId = (organizations, organizationId) => {
  return organizations.find((organization) => {
    const organizationUniqueId = getOrganizationUniqueId(organization);
    return organizationUniqueId === organizationId;
  });
};

const getOrganizationsAsOptions = (organizations) => organizations.map(getOrganizationAsOption);

export const CreateApplicationForm = ({ onSubmit, parent }) => {
  const [form] = Form.useForm();

  const [categoriesOptions, setCategoriesOptions] = useState(null);
  const [organization, setOrganization] = useState({
    id: parent.organizationId,
    type: getOrganizationType(parent.organizationType),
  });

  const { data: organizations, isLoading } = useOrganizationsListQuery({ initialData: [] });

  const { data: categories } = useDFormTemplateCategoriesQuery({
    organizationId: organization?.id,
    organizationType: organization?.type,
  });

  useEffect(() => {
    const updatedOrganization = {
      id: parent.organizationId,
      type: getOrganizationType(parent.organizationType),
    };
    setOrganization(updatedOrganization);

    const defaultCategoryOption = getCategoryAsOption({ categoryId: parent.id, categoryName: parent.name });

    const initialData = {
      category: defaultCategoryOption,
      name: "",
      description: "",
      isPrivate: false,
    };

    form.setFieldsValue(initialData);
  }, [parent]);

  useEffect(() => {
    if (organizations.length > 0) {
      const parentOrganization = organizations.find(
        (parentOrganization) =>
          parentOrganization.id === organization.id && parentOrganization.type === organization.type
      );

      form.setFieldValue("organization", getOrganizationAsOption(parentOrganization));
    }
  }, [organizations, organization]);

  useEffect(() => {
    if (categories) {
      const parsedCategories = categories.map((category) => parseSelectCategory(category));
      setCategoriesOptions(getCategoriesAsOptions(parsedCategories));
    }
  }, [categories]);

  const onOrganizationChange = (_, option) => {
    const organizationUniqueId = option.value;
    const organization = getOrganizationByUniqueId(organizations, organizationUniqueId);

    setOrganization(organization);
    form.setFieldValue("category", null);
  };

  const onFinish = (submittedObj) => {
    _.forOwn(submittedObj, (value, key) => {
      if (value?.value) {
        submittedObj[key] = value.value;
      }
    });

    const organization = getOrganizationByUniqueId(organizations, submittedObj.organization);

    onSubmit({ ...submittedObj, organization });
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical" name="createForm">
      <Form.Item
        label="Select organization"
        name="organization"
        className="dform-field mb-2"
        rules={[{ required: true }]}
      >
        <NmpSelect
          id="organization"
          options={getOrganizationsAsOptions(organizations)}
          onChange={onOrganizationChange}
          isLoading={isLoading}
        />
      </Form.Item>

      <Form.Item
        label="Select organization category"
        name="category"
        className="dform-field mb-2"
        rules={[{ required: true }]}
      >
        <NmpSelect id="category" options={categoriesOptions} />
      </Form.Item>

      <ApplicationDescriptionFormFields categories={undefined} />

      <Form.Item className="d-flex justify-content-end mb-0">
        <NmpButton className="button-success" type="primary" size="large" htmlType="submit">
          Save
        </NmpButton>
      </Form.Item>
    </Form>
  );
};
