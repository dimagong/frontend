import React, { useState, useCallback } from "react";
import _ from "lodash";
import { Scrollbars } from "react-custom-scrollbars";
import { Row, Col, Card, CardBody } from "reactstrap";

import { NmpInput } from "features/nmp-ui/NmpInput";
import WorkFlowsAndNotificationsList from "features/home/ContextSearch/components/WorkFlowsAndNotificationsList";

import { CategoriesHierarchy } from "./CategoriesHierarchy";

import "./styles.scss";

export const Applications = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debounceOnChange = useCallback(
    _.debounce((_searchVal) => {
      setDebouncedSearch(_searchVal);
    }, 1000),
    []
  );

  const handleSearchOnChange = (event) => {
    setSearch(event.target.value);
    debounceOnChange(event.target.value);
  };

  return (
    <Row style={{ marginBottom: "40px" }}>
      <Col className="applications">
        <Card className="mb-3">
          <CardBody className="p-1">
            <Row>
              <Col>
                <div className="application-search-wrapper">
                  <NmpInput
                    id={"search-categories"}
                    type="text"
                    bordered
                    value={search}
                    placeholder={"Search"}
                    onChange={handleSearchOnChange}
                    size="small"
                    className="application-search"
                  />
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>

        <Scrollbars autoHeight autoHeightMax={500}>
          <CategoriesHierarchy search={debouncedSearch} />
        </Scrollbars>
      </Col>

      <WorkFlowsAndNotificationsList context="dForm" />
    </Row>
  );
};
