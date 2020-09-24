import React from 'react'
import {
    Col,
    Button,
  } from "reactstrap";
  import { useDispatch, useSelector } from "react-redux";
  import { selectWorkflow } from "app/selectors/onboardingSelectors";
import WorkflowTrigger from './WorkflowTrigger'

const WorkflowTriggers = () => {
  const workflow = useSelector(selectWorkflow);

    return (
        <Col sm="12">
              {workflow.triggers.map((trigger, keyTrigger) => (
                <WorkflowTrigger trigger={trigger} keyTrigger={keyTrigger}/>
              ))}
              <div className="d-flex justify-content-end flex-wrap mt-2">
                <Button
                  size="sm"
                  color="primary d-flex-left"
                  onClick={() => this.createTrigger()}
                >
                  CREATE TRIGGER
                </Button>
              </div>
            </Col>
    )
}

export default WorkflowTriggers
