import React, {useState} from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Button
} from "reactstrap";
import { X, Eye, EyeOff } from "react-feather";
import MultiSelect from "components/MultiSelect/multiSelect";
import { prepareSelectGroups } from "utility/select/prepareSelectData";
import { useDispatch, useSelector } from "react-redux";
import { selectdForms, selectdForm } from "app/selectors/onboardingSelectors";
import {Check, Plus} from "react-feather";
import ControlsFactory from "./Controls/ControlsFactory";
import FormCreate from "components/FormCreate/FormCreate"
import { setdForm } from "app/slices/onboardingSlice";
import { createdFormRequest, updatedFormRequest } from "app/slices/appSlice";

const DFormForm = ({clearGridSelection, isCreate}) => {
  const dForm = useSelector(selectdForm);
  const [ isStateConfig, setIsStateConfig] = useState(true)
  const dispatch = useDispatch();

  const closeDForm = () => {
    dispatch(setdForm(null));
    clearGridSelection();
  };

  const submitDForm = (dForm, {name, description, protected_properties}) => {
    if(isCreate.current){
      dispatch(createdFormRequest({...dForm, name, description, protected_properties}))
    }else{
      dispatch(updatedFormRequest({...dForm, name, description, protected_properties})) 
    }
  }

  const changeStateConfig = () => {
    setIsStateConfig(!isStateConfig)
  }

  return (
    <Card className="dForm">
      <CardHeader>
        <CardTitle className="font-weight-bold">DForm</CardTitle>
        <div>
          {
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
          }
          <X size={15} className="cursor-pointer mr-1" onClick={closeDForm} />
        </div>
      </CardHeader>
      <CardBody className="card-top-padding">
        <div className="mt-2">
          <MultiSelect setGroups={() => null} groups={prepareSelectGroups(dForm.groups)} />
        </div>
            <FormCreate fileLoader={false}
                                  submitDForm={submitDForm}
                                  liveValidate={false}
                                  isShowToggleProtectedProperties={true}
                                  dForm={dForm}
                                  isStateConfig={isStateConfig}
                      />
      </CardBody>
    </Card>
  );
};

export default DFormForm;
