import "flatpickr/dist/themes/light.css";

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
import { X } from "react-feather";
import { toast } from "react-toastify";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import appSlice from "app/slices/appSlice";
import onboardingSlice from "app/slices/onboardingSlice";
import MultiSelect from "components/MultiSelect/multiSelect";
import { selectWorkflow } from "app/selectors/onboardingSelectors";
import { prepareSelectGroups } from "utility/select/prepareSelectData";
import { selectNotificationsAndWorkFlowsContext } from "app/selectors/layoutSelector";

import { initWorkflow } from "./constants";
import WorkflowTriggers from "./WorkflowTriggers";

const { setWorkflow, setWorkflowGroups } = onboardingSlice.actions;

const { setContext, createWorkflowRequest, updateWorkflowRequest } = appSlice.actions;

const WorkflowForm = ({ workflowModalType }) => {
  const context = useSelector(selectNotificationsAndWorkFlowsContext);
  const workflow = useSelector(selectWorkflow);
  const { name, description } = workflow || {};
  const dispatch = useDispatch();

  const closeWorkflow = () => {
    dispatch(setContext(null));
    dispatch(setWorkflow(null));
  };

  const handleWorkflow = (workflowValue) => {
    dispatch(setWorkflow({ ...workflow, ...workflowValue }));
  };

  const submitWorkflow = (e) => {
    e.preventDefault();
    switch (workflowModalType) {
      case "Edit":
        dispatch(updateWorkflowRequest(workflow));

        break;
      case "Create":
        if (workflow.triggers.length === 0) {
          toast.error("Cannot create a workflow without any triggers");
          break;
        }
        dispatch(createWorkflowRequest({ ...workflow, context }));
        break;
      default:
        return <></>;
    }
  };

  useEffect(() => {
    if (workflowModalType === "Create") {
      dispatch(setWorkflow(initWorkflow));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [workflowModalType]);

  if (!workflow) return null;

  return (
    <Row>
      <Col sm="12" md="12" lg="12" xl="7">
        <Card>
          <CardHeader>
            <CardTitle className="font-weight-bold">
              {workflow.name} <Badge color="info">{workflowModalType}</Badge>
            </CardTitle>
            <X size={15} className="cursor-pointer" onClick={closeWorkflow} />
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
                    onChange={(event) => handleWorkflow({ name: event.target.value })}
                  />
                  <FormFeedback />
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
                    onChange={(event) => handleWorkflow({ description: event.target.value })}
                  />
                  <FormFeedback />
                </FormGroup>
              </Col>
              <Col>
                <MultiSelect groups={prepareSelectGroups(workflow.groups)} setGroups={setWorkflowGroups} />
              </Col>
              <WorkflowTriggers context={context} />

              <Col md="12">
                <div className="d-flex justify-content-center flex-wrap mt-2">
                  <Button color="primary d-flex-left" onClick={submitWorkflow}>
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
