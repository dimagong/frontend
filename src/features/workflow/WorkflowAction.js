import chroma from "chroma-js";
import { X, ChevronDown } from "react-feather";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ListGroupItem, DropdownToggle, DropdownItem, UncontrolledButtonDropdown, DropdownMenu } from "reactstrap";

import {
  selectWorkflow,
  selectdFormActions,
  selectAllowedUserList,
  selectSurveyNotifications,
  selectApplicationNotifications,
} from "app/selectors/onboardingSelectors";
import onboardingSlice from "app/slices/onboardingSlice";
import DeprecatedNmpSelect from "components/nmp/DeprecatedNmpSelect";
import { prepareSelectManagers } from "utility/select/prepareSelectData";
import { selectNotificationsAndWorkFlowsContext } from "app/selectors/layoutSelector";

import { actionTypes, types, userTypeOptions, userTargetTypes, actionTypesByTriggerType } from "./constants";

const { setWorkflowTriggers } = onboardingSlice.actions;

const colorMultiSelect = "#007bff";

const colourStyles = {
  control: (styles) => ({
    ...styles,
    backgroundColor: "white",
    border: 0,
    // This line disable the blue border
    boxShadow: "none",
    minHeight: "auto",
  }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = data.color ? chroma(data.color) : colorMultiSelect;
    return {
      ...styles,
      backgroundColor: isDisabled ? null : isSelected ? data.color : isFocused ? color.alpha(0.1).css() : null,
      color: isDisabled ? "#ccc" : isSelected ? (chroma.contrast(color, "white") > 2 ? "white" : "black") : data.color,
      cursor: isDisabled ? "not-allowed" : "default",

      ":active": {
        ...styles[":active"],
        backgroundColor: !isDisabled && (isSelected ? data.color : "white"),
      },
    };
  },
  multiValue: (styles, { data }) => {
    const color = data.color ? chroma(data.color) : colorMultiSelect;
    return {
      ...styles,
      backgroundColor: color.alpha(0.1).css(),
    };
  },
  multiValueLabel: (styles, { data, isDisabled }) => ({
    ...styles,
    color: data.color ? data.color : colorMultiSelect,
    paddingRight: isDisabled ? "6px" : styles["paddingRight"],
    ":hover": {
      cursor: "pointer",
      backgroundColor: data.color ? data.color : colorMultiSelect,
      color: "white",
    },
  }),
  multiValueRemove: (styles, { data, isDisabled }) => ({
    ...styles,
    display: isDisabled ? "none" : styles["display"],
    color: data.color,
    ":hover": {
      backgroundColor: data.color ? data.color : colorMultiSelect,
      color: "white",
    },
  }),
  valueContainer: (base) => ({
    ...base,
    padding: 0,
    "margin-left": "-2px",
  }),
  indicatorSeparator: (styles) => ({ display: "none" }),
};

const WorkflowAction = ({ keyAction, action, keyTrigger, trigger }) => {
  const dispatch = useDispatch();
  const workflow = useSelector(selectWorkflow);
  const actions = useSelector(selectdFormActions);

  const context = useSelector(selectNotificationsAndWorkFlowsContext);

  const surveyNotifications = useSelector(selectSurveyNotifications);
  const applicationNotifications = useSelector(selectApplicationNotifications);

  const notification = context === "application" ? applicationNotifications : surveyNotifications;

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
                  activeAction.id === action.id ? { ...activeAction, ...actionProperty } : activeAction
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
                  actions: activeTrigger.actions.filter((activeAction) => activeAction.id !== action.id),
                }
              : activeTrigger
          )
        )
      );
    }
  };

  return (
    <ListGroupItem>
      <X size="15" className="x-closer" onClick={removeAction} />
      <div className="d-flex flex-wrap justify-content-center align-items-center w-100">
        <div className="mb-1 w-100 text-center text-primary">Action #{keyAction + 1}</div>
        <div className="text-center w-100">
          <UncontrolledButtonDropdown>
            <DropdownToggle style={{ "border-radius": 0 }} color="primary" size="sm" caret>
              Onboarding
              <ChevronDown size={15} />
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem tag="button">Onboarding</DropdownItem>
            </DropdownMenu>
          </UncontrolledButtonDropdown>
          <UncontrolledButtonDropdown>
            <DropdownToggle style={{ "border-radius": 0 }} color="primary" size="sm" caret>
              {getActionTypeName(action.action_type)}
              <ChevronDown size={15} />
            </DropdownToggle>
            <DropdownMenu>
              {actionTypesByTriggerType[trigger.trigger_type].map((action, label) => (
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
                <DropdownItem onClick={() => setActionProperty({ action_id: actionObj.id })} tag="button">
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
              <DeprecatedNmpSelect
                isCreatable
                style={{ width: "200px" }}
                clearable={false}
                options={userTypeOptions}
                value={userTypeOptions.find((userTypeOption) => userTypeOption.value === action.user_target_type)}
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

            {action.user_target_type === userTargetTypes.managers ? (
              <div className="text-center w-100 mt-2">
                <DeprecatedNmpSelect
                  multiple
                  searchable
                  clearable={false}
                  maxMenuHeight={200}
                  value={prepareSelectManagers(action.action_users)}
                  options={prepareSelectManagers(managers)}
                  styles={colourStyles}
                  onChange={(values) => {
                    setActionProperty({
                      action_users: values ? values.map((value) => value.value) : [],
                    });
                  }}
                  classNamePrefix="select"
                  className="fix-margin-select"
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
