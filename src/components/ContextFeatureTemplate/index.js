import React from 'react';

import {
  Col,
} from 'reactstrap';

import { Search } from "@material-ui/icons";
import { Scrollbars } from 'react-custom-scrollbars';

import './styles.scss'
import {INPUT_HEADER_HEIGHT} from "../../constants/header";

const ContextFeatureTemplate = ({
  onSearchValueChange,
  searchValue,
  contextFeatureTitle,
  children,
  isSearchEnabled,
}) => {

  return (
    <Col xs={6} className="context-feature-template">
      <Scrollbars autoHeight autoHeightMax={window.innerHeight - INPUT_HEADER_HEIGHT}>
      <div className="context-feature-template_header">
        <div className="context-feature-template_header_title">
          {contextFeatureTitle}
        </div>
        {isSearchEnabled && (
          <div className="context-feature-template_header_search">
            <input
              type="text"
              onChange={onSearchValueChange}
              value={searchValue}
            />
            <Search className="context-feature-template_header_search_search-icon" />
          </div>
        )}
      </div>

      {children}

      </Scrollbars>
    </Col>
  )
};

export default ContextFeatureTemplate;
