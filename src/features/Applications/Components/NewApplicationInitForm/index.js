import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Col, Row } from "reactstrap";

import appSlice from "app/slices/appSlice";

import CustomModal from "components/CustomModal";
import ContextTemplate from "components/ContextTemplate";
import { DFormSelectWidget } from "components/DForm/Components/Fields/Components/DFormWidgets/Components/DFormSelectWidget";

import {
  useApplicationsTemplatesQuery,
  useAllowedOrganizationsListQuery,
  useCopyApplicationTemplateMutation,
} from "../../applicationQueries";

const { setContext } = appSlice.actions;

const getOrganizationAsOption = (organization) => ({ value: organization, label: organization.name });
const getOrganizationsAsOptions = (organizations) => organizations.map(getOrganizationAsOption);

const getApplicationTemplateAsOption = (template) => ({ value: template, label: template.name });
const getApplicationsTemplatesAsOptions = (templates) => templates.map(getApplicationTemplateAsOption);

const NewApplicationInitForm = ({ userId, onDFormInitialize }) => {
  const dispatch = useDispatch();

  const [organization, setOrganization] = useState(null);
  const [applicationTemplate, setApplicationTemplate] = useState(null);
  const [isDFormTemplateSelectModalVisible, setIsDFormTemplateSelectModalVisible] = useState(false);

  const allowedOrganizations = useAllowedOrganizationsListQuery(
    { userId },
    { initialData: [], enabled: Boolean(userId) }
  );
  const applicationsTemplates = useApplicationsTemplatesQuery({ initialData: [], enabled: Boolean(organization) });

  const copyApplicationTemplate = useCopyApplicationTemplateMutation(
    { applicationId: applicationTemplate?.id },
    {
      onSuccess: () => dispatch(setContext("dForm")),
    }
  );

  const onOrganizationChange = ({ value }) => setOrganization(value);

  const onApplicationTemplateChange = ({ value }) => setApplicationTemplate(value);

  const initializeDForm = () => onDFormInitialize(organization);

  const onDuplicateBtnSubmit = () => {
    if (!applicationTemplate) return;

    copyApplicationTemplate.mutate();
    setIsDFormTemplateSelectModalVisible(false);
  };

  return (
    <ContextTemplate contextTitle="Application">
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
          </Col>

          {organization ? (
            <>
              <Col md="12">
                <span>Please, create a dForm from scratch or use an existing dForm as a template</span>
                <div className="application_delimiter" />
                <div className="d-flex justify-content-between mt-2">
                  <Button color="primary" onClick={() => setIsDFormTemplateSelectModalVisible(true)}>
                    Duplicate an existing dForm
                  </Button>
                  <Button color="primary" onClick={initializeDForm}>
                    Create form scratch
                  </Button>
                </div>
              </Col>

              <CustomModal
                title="Select dForm"
                submitBtnText="Duplicate"
                isOpen={isDFormTemplateSelectModalVisible}
                onClose={() => setIsDFormTemplateSelectModalVisible(false)}
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
    </ContextTemplate>
  );
};

export default NewApplicationInitForm;
