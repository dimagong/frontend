import { toast } from "react-toastify";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Col, Row } from "reactstrap";
import { Form } from "antd";

import appSlice from "app/slices/appSlice";

import {
  useApplicationsTemplatesQuery,
  useAllowedOrganizationsListQuery,
  useCopyApplicationTemplateMutation,
  useCreateApplicationTemplateMutation,
} from "../../data/applicationQueries";

import { mutateApplication } from "../../data/mutateApplication";

import { ApplicationWrapper } from "./ApplicationWrapper";
import { INITIAL_APPLICATION_DATA } from "../constants";

import { useDFormTemplateCategoriesQuery } from "features/home/ContextSearch/Applications/categoryQueries";
import { parseSelectCategory } from "features/home/ContextSearch/Applications/utils/categoryConverter";
import { getCategoriesAsOptions } from "features/home/ContextSearch/Applications/utils/getCategoryAsOption";
import { NmpSelect } from "features/nmp-ui";

import { CreateApplicationModal } from "./CreateApplicationModal";
import { DuplicateApplicationModal } from "./DuplicateApplicationModal";

const { setContext } = appSlice.actions;

const getOrganizationUniqueId = ({ id, type }) => `${type}/${id}`;

const getOrganizationAsOption = (organization) => ({
  value: getOrganizationUniqueId(organization),
  label: organization.name,
});

const getOrganizationsAsOptions = (organizations) => organizations.map(getOrganizationAsOption);

const getApplicationTemplateAsOption = (template) => ({ value: template.id, label: template.name });

const getApplicationsTemplatesAsOptions = (templates) => templates.map(getApplicationTemplateAsOption);

export const CreateApplicationPage = () => {
  const dispatch = useDispatch();

  const [organization, setOrganization] = useState(null);
  const [category, setCategory] = useState(null);

  const [form] = Form.useForm();

  const [applicationTemplate, setApplicationTemplate] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isDuplicateModalVisible, setIsDuplicateModalVisible] = useState(false);

  const allowedOrganizations = useAllowedOrganizationsListQuery({ initialData: [] });
  const applicationsTemplates = useApplicationsTemplatesQuery({ initialData: [], enabled: Boolean(organization) });

  const templates = applicationsTemplates.data;
  const organizations = allowedOrganizations.data;

  const copyApplicationTemplate = useCopyApplicationTemplateMutation(
    { applicationId: applicationTemplate?.id },
    {
      onSuccess: () => {
        dispatch(setContext("dForm"));
        toast.success("Application duplicated");
      },
      onError: (error) => {
        //TODO handle error
        console.error(error);
      },
    }
  );

  const createApplicationMutation = useCreateApplicationTemplateMutation({
    onSuccess: () => {
      dispatch(setContext("dForm"));
      toast.success("Application created");
    },
    onError: (error) => {
      //TODO handle error
      console.error(error);
    },
  });

  let { data: categories } = useDFormTemplateCategoriesQuery({
    organizationId: organization?.id,
    organizationType: organization?.type,
  });

  let categoriesOptions = null;

  if (categories) {
    categories = categories.map((category) => parseSelectCategory(category));

    categoriesOptions = getCategoriesAsOptions(categories);
  }

  const onOrganizationChange = (_, option) => {
    const uniqueId = option.value;
    const organization = organizations.find((organization) => {
      const organizationUniqueId = getOrganizationUniqueId(organization);
      return organizationUniqueId === uniqueId;
    });

    setOrganization(organization);
    form.setFieldValue("category", null);
    setCategory(null);
  };

  const onCategoryChange = (_, categoryOption) => {
    const newCategory = categories.find((category) => category.categoryId === categoryOption.value);

    setCategory(newCategory);
  };

  const onApplicationTemplateChange = (templateId) => {
    const template = templates.find((template) => template.id === templateId);

    setApplicationTemplate(template);
  };

  const onCreateBtnSubmit = async ({ name, description, isPrivate, category: categoryId, organization }) => {
    await mutateApplication(
      {
        ...INITIAL_APPLICATION_DATA,
        name,
        description,
        isPrivate,
        categoryId,
        organization,
      },
      createApplicationMutation
    );

    setIsCreateModalVisible(false);
  };

  const onDuplicateBtnSubmit = async () => {
    if (!applicationTemplate) return;

    await copyApplicationTemplate.mutateAsync();
    setIsDuplicateModalVisible(false);
  };

  return (
    <Form.Provider
      onFormFinish={(name, { values, forms }) => {
        if (name === "createForm") {
          const { basicForm } = forms;
          const basicFormValues = basicForm.getFieldsValue();

          const organization = organizations.find((organization) => {
            const organizationUniqueId = getOrganizationUniqueId(organization);
            return organizationUniqueId === basicFormValues.organization;
          });

          const mergedForms = { ...basicFormValues, ...values, organization };

          onCreateBtnSubmit(mergedForms);
        }
      }}
    >
      <ApplicationWrapper>
        <div className="height-400">
          <Row className="mx-0">
            <Form
              form={form}
              layout="vertical"
              name={"basicForm"}
              onFinish={onCreateBtnSubmit}
              className="application__form"
            >
              <Col md="12">
                <Form.Item
                  label="Select organization"
                  name="organization"
                  className="dform-field mb-2"
                  rules={[{ required: true }]}
                >
                  <NmpSelect
                    id="organization"
                    options={getOrganizationsAsOptions(allowedOrganizations.data)}
                    onChange={onOrganizationChange}
                    isLoading={allowedOrganizations.isLoading}
                  />
                </Form.Item>

                <Form.Item
                  label="Select organization category"
                  name="category"
                  className="dform-field mb-2"
                  rules={[{ required: true }]}
                >
                  <NmpSelect id="category" options={categoriesOptions} onChange={onCategoryChange} />
                </Form.Item>
              </Col>

              {organization ? (
                <>
                  <Col md="12">
                    <span>Please, create a dForm from scratch or use an existing dForm as a template</span>
                    <div className="application_delimiter" />
                    <div className="d-flex justify-content-between mt-2">
                      <Button color="primary" onClick={() => setIsDuplicateModalVisible(true)} disabled={!category}>
                        Duplicate an existing dForm
                      </Button>
                      <Button color="primary" onClick={() => setIsCreateModalVisible(true)} disabled={!category}>
                        Create from scratch
                      </Button>
                    </div>
                  </Col>

                  <CreateApplicationModal
                    isOpen={isCreateModalVisible}
                    onClose={() => setIsCreateModalVisible(false)}
                  />

                  <DuplicateApplicationModal
                    isOpen={isDuplicateModalVisible}
                    onClose={() => setIsDuplicateModalVisible(false)}
                    options={getApplicationsTemplatesAsOptions(applicationsTemplates.data)}
                    onTemplateChange={onApplicationTemplateChange}
                    onSubmit={onDuplicateBtnSubmit}
                  />
                </>
              ) : null}
            </Form>
          </Row>
        </div>
      </ApplicationWrapper>
    </Form.Provider>
  );
};
