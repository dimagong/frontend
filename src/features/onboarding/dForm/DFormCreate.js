import React from "react";
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

const DFormForm = () => {
  const dForm = useSelector(selectdForm);

  const closeDForm = () => {};

  return (
    <Card className="dForm">
      <CardHeader>
        <CardTitle className="font-weight-bold">DForm</CardTitle>
        <div>
          {
            // this.state.isStateConfig ?
            true ? (
              <EyeOff
                size={15}
                className="cursor-pointer mr-1"
                onClick={() => this.changeStateConfig(false)}
              />
            ) : (
              <Eye
                size={15}
                className="cursor-pointer mr-1"
                onClick={() => this.changeStateConfig(true)}
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
        <Row>
          <Col>
            <div className="dform__form__name form-group border-bottom">
              <label>Name</label>
              <input
                value={dForm.name}
                // onChange={handleDFormName}
                type="text"
                className="form-control"
              />
            </div>
            <div className="dform__form__description form-group border-bottom">
              <label>Description</label>
              <input
                value={dForm.description}
                // onChange={handleDFormDescription}
                type="text"
                className="form-control"
              />
            </div>
            <ControlsFactory {...dForm}/>
            <Row>
              <Col md="12">
                <div className="d-flex justify-content-center flex-wrap mt-2">
                  <Button
                    color="primary d-flex-left"
                    onClick={() => this.submitDForm()}
                  >
                    Save
                  </Button>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default DFormForm;
