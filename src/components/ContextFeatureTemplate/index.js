import React from 'react';

import {
  Col,
} from 'reactstrap';

import { Search } from "@material-ui/icons";

import './styles.scss'

const ContextFeatureTemplate = ({
  onSearchValueChange,
  searchValue,
  contextFeatureTitle,
  children,
  isSearchEnabled,
}) => {

  return (
    <Col xs={6} className="context-feature-template">
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

    </Col>
  )
};

export default ContextFeatureTemplate;
