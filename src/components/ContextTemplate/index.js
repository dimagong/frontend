import "./styles.scss";

import React from "react";
import classnames from "classnames";

import { Col } from "reactstrap";

import ArrowButton from "components/ArrowButton";

import { useDispatch, useSelector } from "react-redux";
import { Scrollbars } from "react-custom-scrollbars";

import { selectContextSearchVisibility } from "app/selectors";

import appSlice from "app/slices/appSlice";
import { INPUT_HEADER_HEIGHT } from "../../constants/header";

const { showContextSearch, hideContextSearch } = appSlice.actions;

const ContextTemplate = ({ contextTitle, contextName, contextHeaderIcon, children }) => {
  const dispatch = useDispatch();

  const isContextSearchVisible = useSelector(selectContextSearchVisibility);

  const handleContextToggle = () => {
    dispatch(isContextSearchVisible ? hideContextSearch() : showContextSearch());
  };

  return (
    <Col xl={6} className="context-template">
      <div className="context-template_hide-context">
        <ArrowButton direction={isContextSearchVisible ? "up" : "down"} onClick={handleContextToggle} />
      </div>

      <Scrollbars autoHeight autoHeightMax={window.innerHeight - INPUT_HEADER_HEIGHT}>
        <div style={{ paddingRight: "15px" }}>
          <div className="context-template_header">
            <div className="d-flex">
              <div className={classnames("context-template_header_title", { "border-right-0": contextName })}>
                {contextTitle}
              </div>

              {contextName ? <div className="context-template_header_survey-name">{contextName}</div> : null}
            </div>

            {contextHeaderIcon ? <div className="context-template_header_edit-icon">{contextHeaderIcon}</div> : null}
          </div>

          {children}
        </div>
      </Scrollbars>
    </Col>
  );
};

export default ContextTemplate;
