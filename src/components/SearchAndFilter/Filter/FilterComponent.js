import React, {useEffect} from "react";
import { Row, Col, Card, Button, ListGroup, ListGroupItem } from "reactstrap";

import FilterOptions from "./FilterComponents/FilterOptions";
import FilterOptionTitles from "./FilterComponents/FilterOptionTitles";
import FilterFooter from "./FilterComponents/FilterFooter";
import Filter from "./Filter";
import PropTypes from "prop-types";

const FilterComponent = (props) => {
  const {
    objectsToFilter,
    filterOptionsDictionary,
    filterFunction,
    filter,
    setFilter,
  } = props;

  return (
    <span className={"filter-box opened"}>
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
                onClick={() => {filterFunction(filter, objectsToFilter)}}
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

FilterComponent.defaultProps = {
  objectsToFilter: [],
};

FilterComponent.propTypes = {
  objectsToFilter: PropTypes.array,
  filter: PropTypes.object,
  setFilter: PropTypes.func,
  filterOptionsDictionary: PropTypes.object,
  filterFunction: PropTypes.func,
};

export default FilterComponent;
