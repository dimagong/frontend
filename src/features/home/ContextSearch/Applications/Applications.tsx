import "./styles.scss";

import _ from "lodash";
import { useDispatch } from "react-redux";
import { Scrollbars } from "react-custom-scrollbars";
import { Row, Col, Card, CardBody } from "reactstrap";
import React, { useState, useCallback, useEffect } from "react";

import appSlice from "app/slices/appSlice";
import { NmpSelect, NmpInput } from "features/nmp-ui";
import WorkFlowsAndNotificationsList from "features/home/ContextSearch/components/WorkFlowsAndNotificationsList";

import { CategoriesHierarchy } from "./CategoriesHierarchy";

import { useDFormTemplateRootCategoriesQuery } from "./categoryQueries";

import { getRootCategoriesAsOptions } from "./utils/getCategoryAsOption";
import { camelize } from "utility/camelize";

import { getOrganizationType, OrganizationTypes } from "constants/organization";

const { getWorkflowsRequest, getNotificationsRequest } = appSlice.actions;

export const Applications = () => {
  const dispatch = useDispatch();

  const [search, setSearch] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  const [rootCategoryId, setRootCategoryId] = useState<number>();

  const { data: rootCategories } = useDFormTemplateRootCategoriesQuery();

  let rootCategoriesAsOption;

  if (rootCategories?.length > 0) {
    const camelizedRootCategories = rootCategories.map((category) => camelize(category));

    camelizedRootCategories.sort((a, b) => a.id - b.id);

    // Set default category
    if (!rootCategoryId) {
      const rootCategory =
        camelizedRootCategories.find(
          (category) => getOrganizationType(category.categorizableType) === OrganizationTypes.network
        ) || camelizedRootCategories[0];

      setRootCategoryId(rootCategory.id);
    }

    rootCategoriesAsOption = getRootCategoriesAsOptions(camelizedRootCategories);
  }

  const onRootCategoryChange = (value: number) => {
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

  useEffect(() => {
    // @ts-ignore
    dispatch(getWorkflowsRequest());
    // @ts-ignore
    dispatch(getNotificationsRequest());
  }, []);

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
