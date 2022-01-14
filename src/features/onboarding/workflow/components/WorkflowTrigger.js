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
import {X, ChevronDown} from "react-feather";
import WorkflowAction from "./WorkflowAction";
import {useDispatch, useSelector} from "react-redux";
import {
  selectWorkflow,
  selectdFormTriggers,
} from "app/selectors/onboardingSelectors";
import {triggerTypes as allTriggerTypes, types, triggerByTriggerType, triggerTypesStrings} from "./constants";

import onboardingSlice from 'app/slices/onboardingSlice';
import {selectSurveyTriggers} from "../../../../app/selectors/onboardingSelectors";

const {
  setWorkflowTriggers,
} = onboardingSlice.actions;

const WorkflowTrigger = ({keyTrigger, trigger, context}) => {
  const workflow = useSelector(selectWorkflow);
  const triggers = useSelector(selectdFormTriggers);
  const surveyTriggers = useSelector(selectSurveyTriggers);
  const dispatch = useDispatch();

  const triggerTypes = allTriggerTypes;

  const isTriggerDisabled = (type) => {
    if (type === types.dform.trigger) {
      return false;
    }
    if (type === types.survey.trigger) {
      return false;
    }
    return true;
  };

  const getTriggerTypeName = (type) => {
    const trigger = triggerTypes.find((trigger) => trigger.type === type);
    return trigger ? trigger.label : "none";
  };
  const getTriggerNameById = (id, type) => {
    if (!(type in triggerByTriggerType)) {
      return 'none';
    }
    let trigger;
    console.log(triggerByTriggerType[type].trigger, surveyTriggers);
    if (type === 'survey_trigger') {
      trigger =
        type === triggerByTriggerType[type].trigger
          ? surveyTriggers.find((trigger) => trigger.id === id)
          : null;
    } else {
      trigger =
        type === triggerByTriggerType[type].trigger
          ? triggers.find((trigger) => trigger.id === id)
          : null;
    }
    console.log(type, trigger);
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
            ? {...element, ...triggerProperty}
            : element
        )
      )
    );
  };

  const getListTriggers = () => {
    if (!trigger.trigger_type) {
      return null;
    }

    if (
      trigger.trigger_type === triggerTypesStrings.dForm &&
      triggerByTriggerType[trigger.trigger_type].trigger === trigger.trigger_type
    ) {
      return triggers.map((trigger) => (
        <DropdownItem
          onClick={() =>
            setTriggerProperty({trigger_id: trigger.id})
          }
          tag="button"
        >
          {trigger.trigger}
        </DropdownItem>
      ));
    } else if (
      trigger.trigger_type === triggerTypesStrings.survey
      && triggerByTriggerType[trigger.trigger_type].trigger === trigger.trigger_type
    ) {
      return surveyTriggers.map((trigger) => (
        <DropdownItem
          onClick={() =>
            setTriggerProperty({trigger_id: trigger.id})
          }
          tag="button"
        >
          {trigger.trigger}
        </DropdownItem>
      ));
    }

    return null;
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
                  id: element.actions.length ? element.actions[element.actions.length - 1].id + 1 : 0,
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
        <X size="15" className="x-closer" onClick={removeTrigger}/>
        <div className="d-flex flex-wrap justify-content-center align-items-center w-100">
          <div className="mb-1 w-100 text-center text-primary">
            Trigger #{keyTrigger + 1}
          </div>
          <div className="text-center w-100">
            <UncontrolledButtonDropdown>
              <DropdownToggle
                style={{"border-radius": 0}}
                color="primary"
                size="sm"
                caret
              >
                Onboarding
                <ChevronDown size={15}/>
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem tag="button">Onboarding</DropdownItem>
              </DropdownMenu>
            </UncontrolledButtonDropdown>
            <UncontrolledButtonDropdown>
              <DropdownToggle
                style={{"border-radius": 0}}
                color="primary"
                size="sm"
                caret
              >
                {getTriggerTypeName(trigger.trigger_type)}
                <ChevronDown size={15}/>
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
                style={{"border-radius": 0}}
                color="primary"
                size="sm"
                caret
              >
                {getTriggerNameById(trigger.trigger_id, trigger.trigger_type)}
                <ChevronDown size={15}/>
              </DropdownToggle>
              <DropdownMenu>
                {
                  getListTriggers()
                }
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
