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
import { prepareSelectData } from "utility/select/prepareSelectData";
import { selectWorkflow } from "app/selectors/onboardingSelectors";
import { useDispatch, useSelector } from "react-redux";
import { setWorkflow, setWorkflowGroups } from "app/slices/onboardingSlice";
import { createWorkflowRequest, updateWorkflowRequest } from "app/slices/appSlice";

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
              <MultiSelect groups={prepareSelectData(workflow.groups)} setGroups={setWorkflowGroups}/>
            </Col>

            <Col sm="12">
              {workflow.triggers.map((trigger, keyTrigger) => (
                <ListGroupItem>
                  <ListGroupItemHeading className="d-flex workflow-edit-font-trigger-head">
                    <X
                      size="15"
                      className="x-closer"
                      onClick={() => {
                        this.removeTrigger(keyTrigger);
                      }}
                    />
                    <div className="d-flex flex-wrap justify-content-center align-items-center w-100">
                      <div className="mb-1 w-100 text-center text-primary">
                        Trigger #{keyTrigger + 1}
                      </div>
                      <div className="text-center w-100">
                        <UncontrolledButtonDropdown>
                          <DropdownToggle
                            style={{ "border-radius": 0 }}
                            color="primary"
                            size="sm"
                            caret
                          >
                            Onboarding
                            <ChevronDown size={15} />
                          </DropdownToggle>
                          <DropdownMenu>
                            <DropdownItem tag="button">Onboarding</DropdownItem>
                          </DropdownMenu>
                        </UncontrolledButtonDropdown>
                        <UncontrolledButtonDropdown>
                          <DropdownToggle
                            style={{ "border-radius": 0 }}
                            color="primary"
                            size="sm"
                            caret
                          >
                            {/* {this.getTriggerTypeName(trigger.trigger_type)} */}
                            <ChevronDown size={15} />
                          </DropdownToggle>
                          <DropdownMenu>
                            {/* {this.state.triggerTypes.map((trigger, label) => (
                                <DropdownItem
                                  onClick={() =>
                                    this.setWorkflowTriggerType(
                                      keyTrigger,
                                      trigger.type
                                    )
                                  }
                                  tag="button"
                                >
                                  {trigger.label}
                                </DropdownItem>
                              ))} */}
                          </DropdownMenu>
                        </UncontrolledButtonDropdown>
                        <UncontrolledButtonDropdown>
                          <DropdownToggle
                            // disabled={
                            //   !this.checkTriggersTypeIsCorrect(
                            //     trigger.trigger_type
                            //   )
                            // }
                            style={{ "border-radius": 0 }}
                            color="primary"
                            size="sm"
                            caret
                          >
                            {/* {this.getTriggerNameById(
                              trigger.trigger_id,
                              trigger.trigger_type
                            )} */}
                            <ChevronDown size={15} />
                          </DropdownToggle>
                          <DropdownMenu>
                            {/* {this.getTriggersByType(trigger.trigger_type).map(
                              (triggerObj) => (
                                <DropdownItem
                                  onClick={() =>
                                    this.setWorkflowTrigger(
                                      keyTrigger,
                                      triggerObj
                                    )
                                  }
                                  tag="button"
                                >
                                  {triggerObj.trigger}
                                </DropdownItem>
                              )
                            )} */}
                          </DropdownMenu>
                        </UncontrolledButtonDropdown>
                      </div>
                    </div>
                  </ListGroupItemHeading>
                  <ListGroup className="d-flex mt-2">
                    {trigger.actions.map((action, keyAction) => (
                      <ListGroupItem>
                        <X
                          size="15"
                          className="x-closer"
                          onClick={() => {
                            this.removeAction(keyTrigger, keyAction);
                          }}
                        />
                        <div className="d-flex flex-wrap justify-content-center align-items-center w-100">
                          <div className="mb-1 w-100 text-center text-primary">
                            Action #{keyAction + 1}
                          </div>
                          <div className="text-center w-100">
                            <UncontrolledButtonDropdown>
                              <DropdownToggle
                                style={{ "border-radius": 0 }}
                                color="primary"
                                size="sm"
                                caret
                              >
                                Onboarding
                                <ChevronDown size={15} />
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem tag="button">
                                  Onboarding
                                </DropdownItem>
                              </DropdownMenu>
                            </UncontrolledButtonDropdown>
                            <UncontrolledButtonDropdown>
                              <DropdownToggle
                                style={{ "border-radius": 0 }}
                                color="primary"
                                size="sm"
                                caret
                              >
                                {/* {this.getTriggerActionTypeName(
                                  action.action_type
                                )} */}
                                <ChevronDown size={15} />
                              </DropdownToggle>
                              <DropdownMenu>
                                {/* {this.state.actionTypes.map((action, label) => (
                                  <DropdownItem
                                    onClick={() =>
                                      this.setWorkflowTriggerActionType(
                                        keyTrigger,
                                        keyAction,
                                        action.type
                                      )
                                    }
                                    tag="button"
                                  >
                                    {action.label}
                                  </DropdownItem>
                                ))} */}
                              </DropdownMenu>
                            </UncontrolledButtonDropdown>
                            <UncontrolledButtonDropdown>
                              <DropdownToggle
                                // disabled={
                                //   !this.checkTriggersActionTypeIsCorrect(
                                //     action.action_type
                                //   )
                                // }
                                style={{ "border-radius": 0 }}
                                color="primary"
                                size="sm"
                                caret
                              >
                                {/* {this.getTriggerActionNameById(
                                  action.action_id,
                                  action.action_type
                                )} */}
                                <ChevronDown size={15} />
                              </DropdownToggle>
                              <DropdownMenu>
                                {/* {this.getTriggerActionsByType(
                                  action.action_type
                                ).map((actionObj) => (
                                  <DropdownItem
                                    onClick={() =>
                                      this.setWorkflowTriggerAction(
                                        keyTrigger,
                                        keyAction,
                                        actionObj
                                      )
                                    }
                                    tag="button"
                                  >
                                    {actionObj.action || actionObj.name}
                                  </DropdownItem>
                                ))} */}
                              </DropdownMenu>
                            </UncontrolledButtonDropdown>
                          </div>

                          {action.action_type ===
                          "App\\NotificationTemplate" ? (
                            <div className="text-center w-100">
                              <div className="text-center w-100">
                                <div className="text-center w-100 mt-1 mb-1">
                                  to
                                </div>
                                <CreatableSelect
                                  style={{ width: "200px" }}
                                  isClearable={false}
                                  // options={this.state.userTypeOptions}
                                  // value={this.state.userTypeOptions.find(
                                  //   (userTypeOption) =>
                                  //     userTypeOption.value ===
                                  //     action.user_target_type
                                  // )}
                                  // onChange={(event) => {
                                  //   this.changeUserTypeOption(
                                  //     event,
                                  //     keyTrigger,
                                  //     keyAction
                                  //   );
                                  // }}
                                />
                              </div>
                              {/* {action.user_target_type ===
                              this.userTargetTypes.managers ? (
                                <div className="text-center w-100 mt-2">
                                  <Select
                                    value={action.action_users.map((user) =>
                                      this.transformManagerToSelectFormat(user)
                                    )}
                                    maxMenuHeight={200}
                                    isMulti
                                    isSearchable={true}
                                    isClearable={false}
                                    styles={colourStyles}
                                    options={this.state.selectManagers}
                                    className="fix-margin-select"
                                    onChange={(values) => {
                                      this.onChangeActionUser(
                                        values,
                                        keyTrigger,
                                        keyAction
                                      );
                                    }}
                                    classNamePrefix="select"
                                  />
                                </div>
                              ) : null} */}
                            </div>
                          ) : null}
                        </div>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                  <div className="d-flex justify-content-end flex-wrap mt-2">
                    <Button
                      size="sm"
                      color="primary d-flex-left"
                      onClick={() => this.createAction(keyTrigger)}
                    >
                      CREATE ACTION
                    </Button>
                  </div>
                </ListGroupItem>
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
