import React, { useEffect, useState } from "react";
import {
  ListGroupItem,
  DropdownToggle,
  DropdownItem,
  UncontrolledButtonDropdown,
  DropdownMenu,
} from "reactstrap";
import CreatableSelect from "react-select/creatable";
import { X, ChevronDown } from "react-feather";
import {
  actionTypes,
  types,
  userTypeOptions,
  userTargetTypes,
} from "./constants";
import { useDispatch, useSelector } from "react-redux";
import {
  selectWorkflow,
  selectNotifications,
  selectdFormActions,
  selectAllowedUserList
} from "app/selectors/onboardingSelectors";
import { selectManagers } from "app/selectors/userSelectors";
import Select from "react-select";
import { colourStyles } from "utility/select/selectSettigns";
import {prepareSelectManagers} from "utility/select/prepareSelectData";

import onboardingSlice from 'app/slices/onboardingSlice';

const {
  setWorkflowTriggers,
} = onboardingSlice.actions;

const WorkflowAction = ({ keyAction, action, keyTrigger, trigger }) => {
  const dispatch = useDispatch();
  const workflow = useSelector(selectWorkflow);
  const actions = useSelector(selectdFormActions);
  const notification = useSelector(selectNotifications);
  const managers = useSelector(selectAllowedUserList);
  const [actionData, setActionData] = useState([]);

  useEffect(() => {
    setActionData(
      action.action_type === types.dform.action
        ? actions
        : action.action_type === types.notification.action
        ? notification
        : []
    );
  }, [action, actions, notification]);

  const isActionDisabled = (type) => {
    if (type === types.dform.action) {
      return false;
    }
    if (type === types.notification.action) {
      return false;
    }
    return true;
  };

  const getActionTypeName = (type) => {
    const action = actionTypes.find((action) => action.type === type);
    return action ? action.label : "none";
  };

  const getActiveNameById = (id) => {
    const action = actionData.find((action) => action.id === id);
    return action ? action.action || action.name : "none";
  };

  const setActionProperty = (actionProperty) => {
    dispatch(
      setWorkflowTriggers(
        workflow.triggers.map((activeTrigger) =>
          activeTrigger.id === trigger.id
            ? {
                ...activeTrigger,
                actions: activeTrigger.actions.map((activeAction) =>
                  activeAction.id === action.id
                    ? { ...activeAction, ...actionProperty }
                    : activeAction
                ),
              }
            : activeTrigger
        )
      )
    );
  };

  const removeAction = () => {
    if (window.confirm("Are you sure?")) {
      dispatch(
        setWorkflowTriggers(
          workflow.triggers.map((activeTrigger) =>
          activeTrigger.id === trigger.id
            ? {
                ...activeTrigger,
                actions: activeTrigger.actions.filter((activeAction) =>
                  activeAction.id !== action.id
                ),
              }
            : activeTrigger
        )
        )
      );
    }
  };

  return (
    <ListGroupItem>
      <X
        size="15"
        className="x-closer"
        onClick={removeAction}
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
              {getActionTypeName(action.action_type)}
              <ChevronDown size={15} />
            </DropdownToggle>
            <DropdownMenu>
              {actionTypes.map((action, label) => (
                <DropdownItem
                  onClick={() =>
                    setActionProperty({
                      action_type: action.type,
                      action_id: -1,
                    })
                  }
                  tag="button"
                >
                  {action.label}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledButtonDropdown>
          <UncontrolledButtonDropdown>
            <DropdownToggle
              disabled={isActionDisabled(action.action_type)}
              style={{ "border-radius": 0 }}
              color="primary"
              size="sm"
              caret
            >
              {getActiveNameById(action.action_id)}
              <ChevronDown size={15} />
            </DropdownToggle>
            <DropdownMenu>
              {actionData.map((actionObj) => (
                <DropdownItem
                  onClick={() => setActionProperty({ action_id: actionObj.id })}
                  tag="button"
                >
                  {actionObj.action || actionObj.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </UncontrolledButtonDropdown>
        </div>

        {action.action_type === "App\\NotificationTemplate" ? (
          <div className="text-center w-100">
            <div className="text-center w-100">
              <div className="text-center w-100 mt-1 mb-1">to</div>
              <CreatableSelect
                style={{ width: "200px" }}
                isClearable={false}
                options={userTypeOptions}
                value={userTypeOptions.find(
                  (userTypeOption) =>
                    userTypeOption.value === action.user_target_type
                )}
                onChange={(event) => {
                  event.value === userTargetTypes.subject
                    ? setActionProperty({ user_target_type: event.value })
                    : setActionProperty({
                        user_target_type: event.value,
                        action_users: [],
                      });
                }}
              />
            </div>
            {}
            {action.user_target_type === userTargetTypes.managers ? (
              <div className="text-center w-100 mt-2">
                <Select
                  value={prepareSelectManagers(action.action_users)}
                  maxMenuHeight={200}
                  isMulti
                  isSearchable={true}
                  isClearable={false}
                  styles={colourStyles}
                  options={prepareSelectManagers(managers)}
                  className="fix-margin-select"
                  onChange={(values) => {
                    setActionProperty({
                      action_users: values
                        ? values.map((value) => value.value)
                        : [],
                    });
                  }}
                  classNamePrefix="select"
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </ListGroupItem>
  );
};

export default WorkflowAction;
