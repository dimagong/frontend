import React from 'react';

import {
  Col,
} from 'reactstrap';

import ArrowButton from "components/ArrowButton";

import "./styles.scss";
import {useDispatch, useSelector} from "react-redux";

import {selectContextSearchVisibility} from "app/selectors";

import appSlice from "app/slices/appSlice";

const {
  showContextSearch,
  hideContextSearch,
} = appSlice.actions;

const ContextTemplate = ({
  contextTitle,
  contextName,
  contextHeaderIcon,
  children,
}) => {

  const dispatch = useDispatch();

  const isContextSearchVisible = useSelector(selectContextSearchVisibility);

  const handleContextToggle = () => {
    dispatch(isContextSearchVisible ? hideContextSearch() : showContextSearch());
  };

  return (
    <Col className={"context-template"} xs={6} >
      <div className={"context-template_hide-context"}>
        <ArrowButton onClick={handleContextToggle} direction={isContextSearchVisible ? "up" : "down"} />
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