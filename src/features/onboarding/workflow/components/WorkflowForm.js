import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  FormGroup,
  Row,
  Col,
  Input,
  Button,
  Label,
  FormFeedback,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  DropdownToggle,
  DropdownItem,
  UncontrolledButtonDropdown,
  DropdownMenu,
  Badge,
} from "reactstrap";
import CreatableSelect from "react-select/creatable";
import "flatpickr/dist/themes/light.css";
import { X, ChevronDown } from "react-feather";
import MultiSelect from "components/MultiSelect/multiSelect";
import { prepareSelectGroups } from "utility/select/prepareSelectData";
import { selectWorkflow } from "app/selectors/onboardingSelectors";
import { useDispatch, useSelector } from "react-redux";
import { setWorkflow, setWorkflowGroups } from "app/slices/onboardingSlice";
import { createWorkflowRequest, updateWorkflowRequest } from "app/slices/appSlice";
import WorkflowTriggers from './WorkflowTriggers'

const WorkflowForm = ({ clearGridSelection, workflowModalType }) => {
  const workflow = useSelector(selectWorkflow);
  const { name, description } = workflow || {};
  const dispatch = useDispatch();

  const closeWorkflow = () => {
    clearGridSelection();
    dispatch(setWorkflow(null));
  };

  const handleWorkflow = (workflowValue) => {
    dispatch(setWorkflow({ ...workflow, ...workflowValue }));
  };

const submitWorkflow = (e) => {
    e.preventDefault();
    switch (workflowModalType) {
      case "Edit":
        dispatch(updateWorkflowRequest(workflow)) 

        break;
        case "Create":
      dispatch(createWorkflowRequest(workflow))
      break;
      default:
        return <></>
    }
}

  return (
    <Col col="md-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-weight-bold">
            {workflow.name} <Badge color="info">{workflowModalType}</Badge>
          </CardTitle>
          <X
            size={15}
            className="cursor-pointer"
            onClick={closeWorkflow}
          />
        </CardHeader>
        <CardBody className="card-top-padding">
          <Row className="mt-2">
            <Col sm="12">
              <FormGroup>
                <Label for="">Name</Label>
                <Input
                  type="text"
                  name="Name"
                  id="mobileVertical"
                  placeholder="Name"
                  value={name}
                  onChange={(event) => handleWorkflow({name: event.target.value})}
                />
                <FormFeedback></FormFeedback>
              </FormGroup>
            </Col>
            <Col sm="12">
              <FormGroup>
                <Label for="">Description</Label>
                <Input
                  type="text"
                  name="description"
                  id="mobileVertical"
                  placeholder="description"
                  value={description}
                  onChange={(event) => handleWorkflow({description: event.target.value})}
                />
                <FormFeedback></FormFeedback>
              </FormGroup>
            </Col>
            <Col>
              <MultiSelect groups={prepareSelectGroups(workflow.groups)} setGroups={setWorkflowGroups}/>
            </Col>
            <WorkflowTriggers/>
            
            <Col md="12">
              <div className="d-flex justify-content-center flex-wrap mt-2">
                <Button
                  color="primary d-flex-left"
                  onClick={submitWorkflow}
                >
                  Save
                </Button>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default WorkflowForm;
