import React from 'react';

import {
  Col,
} from 'reactstrap';

import ChevronUpButton from "components/ChevronUpButton";

import "./styles.scss";
import {useDispatch} from "react-redux";

import appSlice from "app/slices/appSlice";

const {
  setContext,
} = appSlice.actions;

const ContextTemplate = ({
  contextTitle,
  contextName,
  contextHeaderIcon,
  children,
  onContextHide,
}) => {

  const dispatch = useDispatch();

  const handleContextHide = () => {
    onContextHide && onContextHide();
    dispatch(setContext(null));
  };

  return (
    <Col className={"context-template"} xs={6} >
      <div className={"context-template_hide-context"}>
        <ChevronUpButton onClick={handleContextHide} />
      </div>

      <div className={"context-template_header"}>
        <div className={"d-flex"}>
          <div className={`context-template_header_title ${contextName ? "" : "border-right-0"}`}>
            {contextTitle}
          </div>
          {!!contextName && (
            <div className={"context-template_header_survey-name"}>
              {contextName}
            </div>
          )}
        </div>
        {!!contextHeaderIcon && (
          <div className={"context-template_header_edit-icon"}>
            {contextHeaderIcon}
          </div>
        )}
      </div>

      {children}

    </Col>
  )
};

export default ContextTemplate;
