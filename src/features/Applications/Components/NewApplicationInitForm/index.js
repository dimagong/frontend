import React, { useState } from "react";
import ContextTemplate from "components/ContextTemplate";
import MultiSelect from "../../../../components/MultiSelect/multiSelect";
import { prepareSelectGroups } from "../../../../utility/select/prepareSelectData";
import { Button, Col, Row } from "reactstrap";
import SurveySelectComponent from "../../../Surveys/Components/SurveyFormComponents/Select";
import CustomModal from "../../../../components/CustomModal";
import onboardingSlice from "../../../../app/slices/onboardingSlice";
import { useAllowedOrganizationsListQuery } from "../../applicationQueries";
import FieldLabel from "../../../../components/DForm/Components/Fields/Components/DFormWidgets/Components/FieldLabel";
import Select from "react-select";
import { colourStyles } from "../../../../components/DForm/Components/Fields/Components/DFormWidgets/Components/Select";

const { setdFormGroups } = onboardingSlice.actions;

const prepareOrganization = (organization) => ({
  value: organization,
  label: organization.name,
});

const NewApplicationInitForm = ({ userId, onDFormInitialize }) => {
  const [organization, setOrganization] = useState(null);
  const [isDFormTemplateSelectModalVisible, setIsDFormTemplateSelectModalVisible] = useState(false);

  const { data: allowedOrganizations, isLoading } = useAllowedOrganizationsListQuery(
    { userId },
    {
      enabled: Boolean(userId),
    }
  );

  const handleOrganizationSelect = ({ value: organization }) => {
    setOrganization(organization);
  };

  const initializeDForm = () => {
    onDFormInitialize();
  };

  return (
    <ContextTemplate contextTitle={"Application"}>
      <Row className="mr-0 ml-0">
        <Col md={12} className={"custom-react-select mb-2 w-100"}>
          <FieldLabel label={"Select organization"} />
          <Select
            maxMenuHeight={175}
            styles={colourStyles}
            name="organizations"
            value={organization ? prepareOrganization(organization) : null}
            onChange={handleOrganizationSelect}
            options={(!isLoading && allowedOrganizations && allowedOrganizations.map(prepareOrganization)) || []}
            className="React"
            classNamePrefix="select"
            placeholder={"Select organization"}
            isLoading={isLoading}
            menuPosition="fixed"
            noOptionsMessage={() => (isLoading ? "Loading..." : "No organization found")}
          />
        </Col>
        {!!organization && (
          <Col md={12}>
            <span>Please, create a dForm from scratch or use an existing dForm as a template</span>
            <div className={"application_delimiter"} />
            <div className="d-flex justify-content-between mt-2">
              <Button onClick={() => setIsDFormTemplateSelectModalVisible(true)} color="primary">
                Duplicate an existing dForm
              </Button>
              <Button
                onClick={() => {
                  initializeDForm();
                }}
                color="primary"
              >
                Create form scratch
              </Button>
            </div>
          </Col>
        )}
        <CustomModal
          isOpen={isDFormTemplateSelectModalVisible}
          onClose={() => setIsDFormTemplateSelectModalVisible(false)}
          title="Select dForm"
          onSubmit={() => setIsDFormTemplateSelectModalVisible(false)}
          submitBtnText="Duplicate"
        >
          <SurveySelectComponent
            className="mb-2"
            value={null}
            onChange={() => {}}
            label="Select dForm to use as a template"
            noOptionsMessage={() => "There are no dForm that can be used as a template"}
            options={[]}
          />
        </CustomModal>
      </Row>
      {/*<div className="mt-2">*/}
      {/*  <MultiSelect*/}
      {/*    setGroups={setdFormGroups}*/}
      {/*    groups={prepareSelectGroups(dForm.groups)}*/}
      {/*    single*/}
      {/*    noDropdownIndicator*/}
      {/*  />*/}
      {/*  {!!dForm.groups.length && (*/}
      {/*    <div>*/}
      {/*      <span>Please, create a dForm from scratch or use an existing dForm as a template</span>*/}
      {/*      <div className="d-flex justify-content-around mt-2">*/}
      {/*        <Button onClick={() => setIsDFormTemplateSelectModalVisible(true)} color="primary">*/}
      {/*          Duplicate an existing dForm*/}
      {/*        </Button>*/}
      {/*        <Button*/}
      {/*          onClick={() => {*/}
      {/*            initializeDForm();*/}
      {/*          }}*/}
      {/*          color="primary"*/}
      {/*        >*/}
      {/*          Create form scratch*/}
      {/*        </Button>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  )}*/}
      {/*</div>*/}
      {/*<CustomModal*/}
      {/*  isOpen={isDFormTemplateSelectModalVisible}*/}
      {/*  onClose={() => setIsDFormTemplateSelectModalVisible(false)}*/}
      {/*  title="Select dForm"*/}
      {/*  onSubmit={handleDFormDuplicate}*/}
      {/*  submitBtnText="Duplicate"*/}
      {/*>*/}
      {/*  <SurveySelectComponent*/}
      {/*    className="mb-2"*/}
      {/*    value={dFormTemplate}*/}
      {/*    onChange={setDFormTemplate}*/}
      {/*    label="Select dForm to use as a template"*/}
      {/*    noOptionsMessage={() => "There are no dForm that can be used as a template"}*/}
      {/*    options={getOptionsByOrganization(dForm.groups[0])}*/}
      {/*  />*/}
      {/*</CustomModal>*/}
    </ContextTemplate>
  );
};

export default NewApplicationInitForm;
