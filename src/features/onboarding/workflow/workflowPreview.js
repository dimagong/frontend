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
import {selectWorkflow, selectWorkflows} from "app/selectors/onboardingSelectors";
import { useDispatch, useSelector } from "react-redux";
import { setWorkflow, setWorkflowGroups } from "app/slices/onboardingSlice";
import { createWorkflowRequest, updateWorkflowRequest, setPreview } from "app/slices/appSlice";

import {selectPreview} from 'app/selectors/layoutSelector'


const WorkflowFormPreview = ({ workflowModalType }) => {
  const preview = useSelector(selectPreview);
  const workflows = useSelector(selectWorkflows);

  const workflow = workflows.filter(({id}) => id === preview.id)[0]

  const { name, description } = workflow || {};
  const dispatch = useDispatch();

  const closeWorkflow = () => {
    dispatch(setPreview(null))

  };

  if(!workflow) return null;

  return (
    <Row>
      <Col sm="8" >
        <Card className="border">
          <CardHeader>
            <CardTitle className="font-weight-bold">
              Workflow
            </CardTitle>
            <X
              size={15}
              className="cursor-pointer"
              onClick={closeWorkflow}
            />
          </CardHeader>
          <CardBody className="card-top-padding">
            <Row>
              <Col>
                <div className="mt-2">
                  <div className="d-flex mb-1 align-items-center">
                    <div className="width-100">
                      Organisations
                    </div>
                    {workflow.groups && workflow.groups.length ? (
                      workflow.groups.map((group) =>
                        <Badge className="custom-badge" color="primary">
                          {group.name}
                        </Badge>
                      )
                    ) : (
                      <span>No roles</span>
                    )}
                  </div>
                </div>
                <div className="d-flex mb-1">
                  <div className="font-weight-bold-lighter column-sizing-user-info width-100">
                    Name
                  </div>
                  <div className="user-managment__edit_body_user-info-container">
                    <div className=" user-managment__edit_body_form_text">
                      <span>{workflow.name} </span>
                    </div>
                  </div>
                </div>
                <div className="d-flex mb-1">
                  <div className="font-weight-bold-lighter column-sizing-user-info width-100">
                    Description
                  </div>
                  <div className="user-managment__edit_body_user-info-container">
                    <div className=" user-managment__edit_body_form_text">
                      <span>{workflow.description} </span>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default WorkflowFormPreview;
