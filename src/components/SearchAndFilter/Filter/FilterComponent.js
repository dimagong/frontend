import React from "react";
import { Row, Col, Card, Button, ListGroup, ListGroupItem } from "reactstrap";

import FilterOptions from "./FilterComponents/FilterOptions";
import FilterOptionTitles from "./FilterComponents/FilterOptionTitles";
import FilterFooter from "./FilterComponents/FilterFooter";

const FilterComponent = (props) => {
  const {
    objectsToFilter,
    filterOptionsDictionary,
    filterFunction,
    filter,
    setFilter,
    ...attrs
  } = props;

  return (
    <span {...attrs} /*ref={wrapperRefFilterBox}*/ className={"filter-box opened"}>
      <Card style={{ marginBottom: 0 }}>
        <ListGroup variant="flush">
          <ListGroupItem className={"filter-header"}>Filter design</ListGroupItem>
          <ListGroupItem>
            <Row>
              <Col className={"left"}>
                <FilterOptionTitles
                  filter={filter}
                  setFilter={setFilter}
                  filterOptionsDictionary={filterOptionsDictionary}
                />
              </Col>
              <Col className={"right"} id={"filter-options-right"}>
                <span>
                  <FilterOptions
                    filter={filter}
                    setFilter={setFilter}
                    filterOptionsDictionary={filterOptionsDictionary}
                  />
                </span>
              </Col>
            </Row>
          </ListGroupItem>
          <ListGroupItem>
            <FilterFooter
              filter={filter}
            />

            <div className={"filter-footer"}>
              <Button
                variat="success"
                onClick={() => filterFunction(filter, objectsToFilter)}
              >
                Apply filter
              </Button>
            </div>
          </ListGroupItem>
        </ListGroup>
      </Card>
    </span>
  );
};

export default FilterComponent;
