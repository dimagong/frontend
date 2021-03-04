import React from "react";
import {
  Button,
  ListGroup,
  ListGroupItem,
  ListGroupItemHeading,
  DropdownToggle,
  DropdownItem,
  UncontrolledButtonDropdown,
  DropdownMenu,
} from "reactstrap";
import { X, ChevronDown } from "react-feather";
import WorkflowAction from "./WorkflowAction";
import { useDispatch, useSelector } from "react-redux";
import { setWorkflowTriggers } from "app/slices/onboardingSlice";
import {
  selectWorkflow,
  selectdFormTriggers,
} from "app/selectors/onboardingSelectors";
import { triggerTypes, types } from "./constants";

const WorkflowTrigger = ({ keyTrigger, trigger }) => {
  const workflow = useSelector(selectWorkflow);
  const triggers = useSelector(selectdFormTriggers);
  const dispatch = useDispatch();

  const isTriggerDisabled = (type) => {
    if (type === types.dform.trigger) {
      return false;
    }
    return true;
  };

  const getTriggerTypeName = (type) => {
    const trigger = triggerTypes.find((trigger) => trigger.type === type);
    return trigger ? trigger.label : "none";
  };
  const getTriggerNameById = (id, type) => {
    const trigger =
      type === types.dform.trigger
        ? triggers.find((trigger) => trigger.id === id)
        : null;
    return trigger ? trigger.trigger : "none";
  };

  const removeTrigger = () => {
    if (window.confirm("Are you sure?")) {
      dispatch(
        setWorkflowTriggers(
          workflow.triggers.filter((element) => element.id !== trigger.id)
        )
      );
    }
  };

  const setTriggerProperty = (triggerProperty) => {
    dispatch(
      setWorkflowTriggers(
        workflow.triggers.map((element) =>
          element.id === trigger.id
            ? { ...element, ...triggerProperty }
            : element
        )
      )
    );
  };

  const createAction = () => {
    dispatch(
      setWorkflowTriggers(
        workflow.triggers.map((element) =>
          element.id === trigger.id
            ? {
                ...element,
                actions: [
                  ...element.actions,
                  {
                    action_users: [],
                    id: element.actions.length ? element.actions[element.actions.length - 1].id + 1 : 0  ,
                  },
                ],
              }
            : element
        )
      )
    );
  };

  return (
    <ListGroupItem>
      <ListGroupItemHeading className="d-flex workflow-edit-font-trigger-head">
        <X size="15" className="x-closer" onClick={removeTrigger} />
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
                {getTriggerTypeName(trigger.trigger_type)}
                <ChevronDown size={15} />
              </DropdownToggle>
              <DropdownMenu>
                {triggerTypes.map((trigger) => (
                  <DropdownItem
                    onClick={() =>
                      setTriggerProperty({
                        trigger_type: trigger.type,
                        trigger_id: -1,
                      })
                    }
                    tag="button"
                  >
                    {trigger.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </UncontrolledButtonDropdown>
            <UncontrolledButtonDropdown>
              <DropdownToggle
                disabled={isTriggerDisabled(trigger.trigger_type)}
                style={{ "border-radius": 0 }}
                color="primary"
                size="sm"
                caret
              >
                {getTriggerNameById(trigger.trigger_id, trigger.trigger_type)}
                <ChevronDown size={15} />
              </DropdownToggle>
              <DropdownMenu>
                {types.dform.trigger === trigger.trigger_type
                  ? triggers.map((trigger) => (
                      <DropdownItem
                        onClick={() =>
                          setTriggerProperty({ trigger_id: trigger.id })
                        }
                        tag="button"
                      >
                        {trigger.trigger}
                      </DropdownItem>
                    ))
                  : null}
              </DropdownMenu>
            </UncontrolledButtonDropdown>
          </div>
        </div>
      </ListGroupItemHeading>
      <ListGroup className="d-flex mt-2">
        {trigger.actions.map((action, keyAction) => (
          <WorkflowAction
            action={action}
            keyAction={keyAction}
            keyTrigger={keyTrigger}
            trigger={trigger}
          />
        ))}
      </ListGroup>
      <div className="d-flex justify-content-end flex-wrap mt-2">
        <Button size="sm" color="primary d-flex-left" onClick={createAction}>
          CREATE ACTION
        </Button>
      </div>
    </ListGroupItem>
  );
};

export default WorkflowTrigger;
