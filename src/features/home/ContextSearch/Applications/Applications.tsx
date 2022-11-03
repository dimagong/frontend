import React, { useState, useCallback } from "react";
import _ from "lodash";
import { Scrollbars } from "react-custom-scrollbars";
import { Row, Col, Card, CardBody } from "reactstrap";

import { NmpSelect, NmpInput } from "features/nmp-ui";
import WorkFlowsAndNotificationsList from "features/home/ContextSearch/components/WorkFlowsAndNotificationsList";

import { CategoriesHierarchy } from "./CategoriesHierarchy";

import { useDFormTemplateRootCategoriesQuery } from "./categoryQueries";
import { getRootCategoriesAsOptions } from "./utils/getCategoryAsOption";

import "./styles.scss";

export const Applications = () => {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [rootCategoryId, setRootCategoryId] = useState();

  const { data: rootCategories } = useDFormTemplateRootCategoriesQuery();

  let rootCategoriesAsOption;

  if (rootCategories) {
    // Set default category
    if (!rootCategoryId) {
      setRootCategoryId(rootCategories[0].id);
    }

    rootCategoriesAsOption = getRootCategoriesAsOptions(rootCategories);
  }

  const onRootCategoryChange = (value) => {
    setRootCategoryId(value);
  };

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
                <div className="application-search-wrapper h-100">
                  <NmpInput
                    id={"search-categories"}
                    type="text"
                    bordered
                    value={search}
                    placeholder={"Search"}
                    onChange={handleSearchOnChange}
                    size="small"
                    className="application-search h-100"
                  />
                </div>
              </Col>
              <Col>
                <div className="w-100">
                  <NmpSelect
                    className="w-100"
                    id="rootCategory"
                    options={rootCategoriesAsOption}
                    value={rootCategoryId}
                    onChange={onRootCategoryChange}
                  />
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {rootCategoryId ? (
          <Scrollbars autoHeight autoHeightMax={500}>
            <CategoriesHierarchy search={debouncedSearch} rootCategoryId={rootCategoryId} />
          </Scrollbars>
        ) : null}
      </Col>

      <WorkFlowsAndNotificationsList context="dForm" />
    </Row>
  );
};
