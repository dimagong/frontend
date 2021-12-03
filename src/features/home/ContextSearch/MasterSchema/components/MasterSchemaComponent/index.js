import React from "react";
import { Col, Row } from "reactstrap";
import { Scrollbars } from "react-custom-scrollbars";

import ListItem from "../../../components/ListItem";

const MasterSchemaContextSearchComponent = ({ masterSchemas = [], onMasterSchemaSelect }) => {
  const handleItemSelect = (masterSchema) => onMasterSchemaSelect(masterSchema);

  const selectedItem = {};

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
            {!!masterSchemas.length &&
              masterSchemas.map((item, index) => (
                <ListItem
                  key={index}
                  item={item}
                  onClick={() => {
                    handleItemSelect(item);
                  }}
                  isSelected={selectedItem && selectedItem.id === item.id}
                />
              ))}
          </div>
        </Scrollbars>
      </Col>
    </Row>
  );
};

export default MasterSchemaContextSearchComponent;
