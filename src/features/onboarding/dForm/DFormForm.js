import React, {useState, useEffect} from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Button,
} from "reactstrap";
import { X, Eye, EyeOff } from "react-feather";
import MultiSelect, {DropdownIndicator} from "components/MultiSelect/multiSelect";
import { prepareSelectGroups } from "utility/select/prepareSelectData";
import { useDispatch, useSelector } from "react-redux";
import { selectdForms, selectdForm} from "app/selectors/onboardingSelectors";
import FormCreate from "components/FormCreate/FormCreate"
import {initDForm} from './settings'
import {colourStyles} from '../../../utility/select/selectSettigns'
import Select from 'react-select'
import Checkbox from "../../Surveys/Components/SurveyFormComponents/Checkbox";
import SurveyModal from "../../Surveys/Components/SurveyModal";
import SurveySelectComponent from "../../Surveys/Components/SurveyFormComponents/Select";
import { toast } from 'react-toastify'

import onboardingSlice from 'app/slices/onboardingSlice';
import appSlice from 'app/slices/appSlice'

const {
  setdForm,
  setdFormGroups,
} = onboardingSlice.actions;

const {
  createDFormTemplateRequest,
  setContext,
  updateDFormTemplateRequest,
} = appSlice.actions;

const DFormForm = ({isCreate}) => {
  const dForm = useSelector(selectdForm);
  const dForms = useSelector(selectdForms);
  const [ isStateConfig, setIsStateConfig] = useState(true);
  const [isDFormCreationFormInitialized, setIsDFormCreationFormInitialized] = useState(false);
  const [dFormTemplate, setDFormTemplate] = useState(null);
  const [isApplicationTemplatePrivate, setIsApplicationTemplatePrivate] = useState(isCreate ? false : dForm.is_private);
  const [isDFormTemplateSelectModalVisible, setIsDFormTemplateSelectModalVisible] = useState(false);
  const dispatch = useDispatch();

  const closeDForm = () => {
    dispatch(setContext(null));
    dispatch(setdForm(null));
  };


  const submitDForm = (dForm, {name, description, protected_properties}) => {
    if(isCreate){
      dispatch(createDFormTemplateRequest({...dForm, name, description, protected_properties, is_private: isApplicationTemplatePrivate}))
    }else{
      dispatch(updateDFormTemplateRequest({...dForm, name, description, protected_properties, is_private: isApplicationTemplatePrivate}))
    }
  };

  const changeStateConfig = () => {
    setIsStateConfig(!isStateConfig)
  };

  const handleDFormDuplicate = () => {
    if (!dFormTemplate) {
      toast.error("Please, select a dForm");
    } else {
      initializeDForm(dFormTemplate.value);
      setIsDFormTemplateSelectModalVisible(false);
    }
  };

  const initializeDForm = (dFormTemplate) => {
    if (dFormTemplate) {
      dispatch(setdForm({...dFormTemplate, name: "", description: "", created_at: undefined, updated_at: undefined}))
    }

    setIsDFormCreationFormInitialized(true)
  };

  const getOptionsByOrganization = (organization) => {
    if (!organization) return [];

    const dFormsByOrganization = dForms.filter(dForm =>
      dForm.groups[0].type === organization.type
      && dForm.groups[0].name === organization.name
    );

    return dFormsByOrganization.map(dForm => ({label: dForm.name, value: dForm}))
  };

  useEffect(() => {
    if(isCreate && !isDFormCreationFormInitialized) {
      dispatch(setdForm(initDForm));
      setIsApplicationTemplatePrivate(false);
    }
  }, [isCreate]);

  if(!dForm) return null;

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xl="6">
        <Card className="dform">
          <CardHeader>
            <CardTitle className="font-weight-bold">DForm</CardTitle>
            <div>
              {
                !!dForm.groups.length && (
                  isStateConfig ? (
                    <EyeOff
                      size={15}
                      className="cursor-pointer mr-1"
                      onClick={changeStateConfig}
                    />
                  ) : (
                    <Eye
                      size={15}
                      className="cursor-pointer mr-1"
                      onClick={changeStateConfig}
                    />
                  )
                )
              }
              <X size={15} className="cursor-pointer mr-1" onClick={closeDForm} />
            </div>
          </CardHeader>
          <CardBody className="card-top-padding">
            {isCreate && !isDFormCreationFormInitialized ? (
              <div className="mt-2">
                <MultiSelect setGroups={setdFormGroups} groups={prepareSelectGroups(dForm.groups)} single noDropdownIndicator />
                {!!dForm.groups.length && (
                  <div>
                    <span>Please, create a dForm from scratch or use an existing dForm as a template</span>
                    <div className="d-flex justify-content-around mt-2">
                      <Button onClick={() => setIsDFormTemplateSelectModalVisible(true)} color="primary">
                        Duplicate an existing dForm
                      </Button>
                      <Button onClick={() => {initializeDForm()}} color="primary">
                        Create form scratch
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-2 d-flex justify-content-between">
                <div className="d-flex mb-1">
                  <div className="font-weight-bold" style={{padding: 4}}>Organization</div>
                  <div className="w-100" style={{padding: "4px 4px 4px 0"}}>
                    {dForm.groups[0]?.name}
                  </div>
                </div>
                <div>
                  <Checkbox
                    checked={isApplicationTemplatePrivate}
                    label={"Is private"}
                    onChange={() => setIsApplicationTemplatePrivate(!isApplicationTemplatePrivate)}
                    name={"is_private"}
                  />
                </div>
              </div>
            )}
            {!!dForm.groups.length && (isCreate ? isDFormCreationFormInitialized : true) && (
              <FormCreate fileLoader={false}
                          submitDForm={submitDForm}
                          liveValidate={false}
                          isShowToggleProtectedProperties={true}
                          dForm={dForm}
                          isStateConfig={isStateConfig}
              />
            )}
          </CardBody>
        </Card>
      </Col>

      <SurveyModal
        isOpen={isDFormTemplateSelectModalVisible}
        onClose={() => setIsDFormTemplateSelectModalVisible(false)}
        title="Select dForm"
        onSubmit={handleDFormDuplicate}
        submitBtnText="Duplicate"
      >

        <SurveySelectComponent
          className="mb-2"
          value={dFormTemplate}
          onChange={setDFormTemplate}
          label="Select dForm to use as a template"
          noOptionsMessage={() => "There are no dForm that can be used as a template"}
          options={getOptionsByOrganization(dForm.groups[0])}
        />
      </SurveyModal>
    </Row>
  );
};

export default DFormForm;
