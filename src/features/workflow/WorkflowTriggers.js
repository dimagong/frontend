import React from "react";
import { Col, Button } from "reactstrap";
import { useDispatch, useSelector } from "react-redux";

import onboardingSlice from "app/slices/onboardingSlice";
import { selectWorkflow } from "app/selectors/onboardingSelectors";

import WorkflowTrigger from "./WorkflowTrigger";

const { setWorkflowTriggers } = onboardingSlice.actions;

const WorkflowTriggers = ({ context }) => {
  const workflow = useSelector(selectWorkflow);
  const dispatch = useDispatch();

  const createTrigger = () => {
    dispatch(
      setWorkflowTriggers([
        ...workflow.triggers,
        {
          actions: [],
          id: workflow.triggers.length ? workflow.triggers[workflow.triggers.length - 1].id + 1 : 0,
        },
      ])
    );
  };

  return (
    <Col sm="12">
      {workflow.triggers.map((trigger, keyTrigger) => (
        <WorkflowTrigger context={context} trigger={trigger} keyTrigger={keyTrigger} />
      ))}
      <div className="d-flex justify-content-end flex-wrap mt-2">
        <Button size="sm" color="primary d-flex-left" onClick={createTrigger}>
          CREATE TRIGGER
        </Button>
      </div>
    </Col>
  );
};

export default WorkflowTriggers;
