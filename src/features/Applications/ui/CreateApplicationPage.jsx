import { toast } from "react-toastify";
import React, { useReducer, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Col, Row } from "reactstrap";

import appSlice from "app/slices/appSlice";

import CustomModal from "components/CustomModal";
import { DFormSelectWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormSelectWidget";

import {
  useApplicationsTemplatesQuery,
  useAllowedOrganizationsListQuery,
  useCopyApplicationTemplateMutation,
  useCreateApplicationTemplateMutation,
} from "../../data/applicationQueries";

import { mutateApplication } from "../../data/mutateApplication";

import { ApplicationWrapper } from "./ApplicationWrapper";
import { ApplicationDescriptionFormFields } from "./ApplicationDescriptionFormFields";
import { INITIAL_APPLICATION_DATA } from "../constants";

import { useDFormTemplateCategoriesQuery } from "features/home/ContextSearch/Applications/categoryQueries";
import { parseSelectCategory } from "features/home/ContextSearch/Applications/utils/categoryConverter";
import {
  getCategoriesAsOptions,
  getCategoryAsOption,
} from "features/home/ContextSearch/Applications/utils/getCategoryAsOption";

const { setContext } = appSlice.actions;

const getOrganizationUniqueId = ({ id, type }) => `${type}/${id}`;

const getOrganizationAsOption = (organization) => ({
  value: getOrganizationUniqueId(organization),
  label: organization.name,
});

const getOrganizationsAsOptions = (organizations) => organizations.map(getOrganizationAsOption);

const getApplicationTemplateAsOption = (template) => ({ value: template.id, label: template.name });

const getApplicationsTemplatesAsOptions = (templates) => templates.map(getApplicationTemplateAsOption);

const initialApplicationDescriptionValues = { name: "", description: "", isPrivate: false, categoryId: "" };
const applicationDescriptionReducer = (s, p) => ({ ...s, ...p });

export const CreateApplicationPage = () => {
  const dispatch = useDispatch();

  const [{ name, description, isPrivate }, setApplicationDescriptionValues] = useReducer(
    applicationDescriptionReducer,
    initialApplicationDescriptionValues
  );

  const [organization, setOrganization] = useState(null);
  const [category, setCategory] = useState(null);

  const [applicationTemplate, setApplicationTemplate] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isDuplicateModalVisible, setIsDuplicateModalVisible] = useState(false);

  const allowedOrganizations = useAllowedOrganizationsListQuery({ initialData: [] });
  const applicationsTemplates = useApplicationsTemplatesQuery({ initialData: [], enabled: Boolean(organization) });

  const templates = applicationsTemplates.data;
  const organizations = allowedOrganizations.data;

  const categoryValue = category ? getCategoryAsOption(category) : null;

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

  const onOrganizationChange = (option) => {
    const uniqueId = option.value;
    const organization = organizations.find((organization) => {
      const organizationUniqueId = getOrganizationUniqueId(organization);
      return organizationUniqueId === uniqueId;
    });

    setOrganization(organization);
    setCategory(null);
  };

  const onCategoryChange = (categoryOption) => {
    const newCategory = categories.find((category) => category.id === categoryOption.value);

    setCategory(newCategory);
  };

  const onApplicationTemplateChange = (option) => {
    const templateId = option.value;
    const template = templates.find((template) => template.id === templateId);

    setApplicationTemplate(template);
  };

  const onCreateBtnSubmit = async () => {
    await mutateApplication(
      {
        ...INITIAL_APPLICATION_DATA,
        name,
        description,
        isPrivate,
        categoryId: category.id,
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
    <ApplicationWrapper>
      <div className="height-400">
        <Row className="mx-0">
          <Col md="12">
            <DFormSelectWidget
              id="dform-organization"
              label="Select organization"
              value={organization ? getOrganizationAsOption(organization) : null}
              options={getOrganizationsAsOptions(allowedOrganizations.data)}
              isError={false}
              isLoading={allowedOrganizations.isLoading}
              isRequired={false}
              isDisabled={false}
              isLabelShowing={true}
              onChange={onOrganizationChange}
              className="mb-2"
            />

            <DFormSelectWidget
              id="dform-organization-category"
              label="Select organization category"
              value={categoryValue}
              options={categoriesOptions}
              isError={false}
              isRequired={false}
              isDisabled={false}
              isLabelShowing={true}
              onChange={onCategoryChange}
              className="mb-2"
            />
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

              <CustomModal
                title="Create a dForm"
                submitBtnText="Create"
                isOpen={isCreateModalVisible}
                onClose={() => setIsCreateModalVisible(false)}
                onSubmit={onCreateBtnSubmit}
                isSubmitProceed={createApplicationMutation.isLoading}
              >
                <div className="pb-2">
                  <ApplicationDescriptionFormFields
                    name={name}
                    isPrivate={isPrivate}
                    description={description}
                    onChange={setApplicationDescriptionValues}
                    category={category}
                  />
                </div>
              </CustomModal>

              <CustomModal
                title="Select dForm"
                submitBtnText="Duplicate"
                isOpen={isDuplicateModalVisible}
                onClose={() => setIsDuplicateModalVisible(false)}
                onSubmit={onDuplicateBtnSubmit}
                isSubmitProceed={copyApplicationTemplate.isLoading}
              >
                <DFormSelectWidget
                  id="dform-template-source"
                  label="Application template to duplicate from"
                  value={applicationTemplate ? getApplicationTemplateAsOption(applicationTemplate) : null}
                  options={getApplicationsTemplatesAsOptions(applicationsTemplates.data)}
                  isError={false}
                  isLoading={applicationsTemplates.isLoading}
                  isRequired={false}
                  isDisabled={false}
                  isLabelShowing={true}
                  placeholder={
                    applicationsTemplates.data.length === 0
                      ? `There are no dForm that can be used as a template`
                      : `Select an Application template to duplicate from`
                  }
                  onChange={onApplicationTemplateChange}
                  className="pb-2"
                />
              </CustomModal>
            </>
          ) : null}
        </Row>
      </div>
    </ApplicationWrapper>
  );
};
