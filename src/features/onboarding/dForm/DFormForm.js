import React, {useState, useEffect} from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
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
  const [ isStateConfig, setIsStateConfig] = useState(true)
  const dispatch = useDispatch();

  const closeDForm = () => {
    dispatch(setContext(null))
    dispatch(setdForm(null));
  };

  const submitDForm = (dForm, {name, description, protected_properties}) => {
    if(isCreate){
      dispatch(createDFormTemplateRequest({...dForm, name, description, protected_properties}))
    }else{
      dispatch(updateDFormTemplateRequest({...dForm, name, description, protected_properties}))
    }
  }

  const changeStateConfig = () => {
    setIsStateConfig(!isStateConfig)
  }

  useEffect(() => {
    if(isCreate) {
      dispatch(setdForm(initDForm));
    }
  }, [isCreate])

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
            {isCreate && !dForm.groups.length ? (
              <div className="mt-2">
                <MultiSelect setGroups={setdFormGroups} groups={prepareSelectGroups(dForm.groups)} single noDropdownIndicator />
              </div>
            ) : (
              <div className="mt-2">
                <div className="d-flex mb-1">
                  <div className="font-weight-bold" style={{padding: 4}}>Organization</div>
                  <div className="w-100" style={{padding: "4px 4px 4px 0"}}>
                    {dForm.groups[0]?.name}
                  </div>
                </div>
              </div>
            )}
            {!!dForm.groups.length && (
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
    </Row>
  );
};

export default DFormForm;
