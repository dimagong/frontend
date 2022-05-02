import _ from "lodash/fp";
import React from "react";
import PropTypes from "prop-types";
import { Col, Row, Spinner } from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";

import ListItem from "../../../components/ListItem";

const MasterSchemaContextSearchComponent = ({ masterSchemas, isLoading, selectedId, onSelect }) => {
  const onItemSelect = React.useCallback((masterSchema) => () => onSelect(masterSchema), [onSelect]);

  if (isLoading) {
    return (
      <Row style={{ marginBottom: "40px" }}>
        <Col className="d-flex justify-content-center pt-4">
          <Spinner />
        </Col>
      </Row>
    );
  }

  if (masterSchemas) {
    return (
      <Row style={{ marginBottom: "40px" }}>
        <Col className="applications">
          <div className="list-header">
            <div>Name</div>
            <div />
            <div />
          </div>

          <Scrollbars autoHeight autoHeightMax={500}>
            <div className="items-list">
              {masterSchemas.map((masterSchema) => (
                <ListItem
                  item={masterSchema}
                  onClick={onItemSelect(masterSchema)}
                  isSelected={selectedId === masterSchema.id}
                  key={masterSchema.name}
                />
              ))}
            </div>
          </Scrollbars>
        </Col>
      </Row>
    );
  }

  return null;
};

MasterSchemaContextSearchComponent.defaultProps = {
  onSelect: _.noop,
};

MasterSchemaContextSearchComponent.propTypes = {
  masterSchemas: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
  selectedId: PropTypes.number,
  onSelect: PropTypes.func,
};

export default MasterSchemaContextSearchComponent;
