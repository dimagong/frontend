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
import MultiSelect from "components/MultiSelect/multiSelect";
import { prepareSelectGroups } from "utility/select/prepareSelectData";
import { useDispatch, useSelector } from "react-redux";
import { selectdForms, selectdForm} from "app/selectors/onboardingSelectors";
import FormCreate from "components/FormCreate/FormCreate"
import { setdForm, setdFormGroups } from "app/slices/onboardingSlice";
import {createdFormRequest, setContext, updatedFormRequest} from "app/slices/appSlice";
import {initDForm} from './settings'

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
      dispatch(createdFormRequest({...dForm, name, description, protected_properties}))
    }else{
      dispatch(updatedFormRequest({...dForm, name, description, protected_properties}))
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
      <Col sm="12" md="12" lg="12" xl="7">
        <Card className="dform">
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
              <MultiSelect setGroups={setdFormGroups} groups={prepareSelectGroups(dForm.groups)} />
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
      </Col>
    </Row>
  );
};

export default DFormForm;
