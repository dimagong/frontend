import React, { useEffect } from "react";
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
  Badge,
} from "reactstrap";
import "flatpickr/dist/themes/light.css";
import { X } from "react-feather";
import MultiSelect from "components/MultiSelect/multiSelect";
import { prepareSelectGroups } from "utility/select/prepareSelectData";
import { selectWorkflow } from "app/selectors/onboardingSelectors";
import { selectNotificationsAndWorkFlowsContext } from "app/selectors/layoutSelector";
import { useDispatch, useSelector } from "react-redux";
import WorkflowTriggers from './WorkflowTriggers'
import {initWorkflow} from './constants'

import onboardingSlice from 'app/slices/onboardingSlice';
import appSlice from 'app/slices/appSlice'

const {
  setWorkflow,
  setWorkflowGroups,
} = onboardingSlice.actions;

const {
  setContext,
  createWorkflowRequest,
  updateWorkflowRequest,
} = appSlice.actions;

const WorkflowForm = ({ workflowModalType }) => {
  const context = useSelector(selectNotificationsAndWorkFlowsContext);
  const workflow = useSelector(selectWorkflow);
  const { name, description } = workflow || {};
  const dispatch = useDispatch();

  const closeWorkflow = () => {
    dispatch(setContext(null))
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

  useEffect(() => {
    if(workflowModalType === "Create") {
      dispatch(setWorkflow(initWorkflow))
    }
  }, [workflowModalType])

  if(!workflow) return null;

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xl="7">
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
              <WorkflowTriggers context={context} />

              <Col md="12">
                <div className="d-flex justify-content-center flex-wrap mt-2">
                  <Button
                    color="primary d-flex-left"
                    onClick={submitWorkflow}
                  >
                    {workflowModalType === "Create" ? "Create" : "Save"}
                  </Button>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default WorkflowForm;
