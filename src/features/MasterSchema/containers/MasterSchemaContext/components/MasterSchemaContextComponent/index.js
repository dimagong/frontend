import "./styles.scss";

import _ from "lodash";
import { get } from "lodash/fp";
import { isEmpty } from "lodash/fp";
import { useDispatch, useSelector } from "react-redux";
import React, { useMemo, useRef, useState } from "react";

import appSlice from "app/slices/appSlice";
import { selectdForms } from "app/selectors";
import * as masterSchemaSelectors from "app/selectors/masterSchemaSelectors";

import MSEButton from "features/MasterSchema/share/mse-button";
import { useMasterSchemaContext } from "features/MasterSchema/use-master-schema-context";

import { useDidMount } from "hooks/use-did-mount";
import { useDidUpdate } from "hooks/use-did-update";
import SearchAndFilter from "components/SearchAndFilter";
import ContextTemplate from "components/ContextTemplate";

import MasterSchemaElements from "./components/MasterSchemaElements";
import UnapprovedFieldsComponent from "./components/UnapprovedFieldsComponent";
import { createLoadingSelector } from "app/selectors/loadingSelector";

const {
  getMasterSchemaHierarchyRequest,
  getdFormsRequest,
  setMasterSchemaSearch,
  setUnapprovedMasterSchemaRequest,
  approveUnapprovedFieldsRequest,
} = appSlice.actions;

const MasterSchemaContextComponent = () => {
  const dispatch = useDispatch();
  const allDForms = useSelector(selectdForms);
  const search = useSelector(masterSchemaSelectors.selectSearch);
  const selectedId = useSelector(masterSchemaSelectors.selectSelectedId);
  const isApprovingLoading = useSelector(createLoadingSelector([approveUnapprovedFieldsRequest.type], false));

  const { hierarchy, unapproved, expandable } = useMasterSchemaContext();
  const isSearchingRef = useRef(false);
  const [filterTypes, setFilterTypes] = useState([]);
  const filterNames = useMemo(() => filterTypes.map(get("name")), [filterTypes]);

  const onSearchSubmit = (searchName) => {
    const searchValue = searchName.hasOwnProperty("target") ? searchName.target.value : searchName;
    dispatch(setMasterSchemaSearch({ ...search, value: searchValue }));
  };

  const onFilterSubmit = (filterOptions, filter) => {
    if (!hierarchy) return;

    const filters = _.intersectionBy(
      allDForms.filter((item) => item.groups.filter((group) => group.name === hierarchy.name).length > 0),
      filter.applications.map((item) => {
        return { name: item };
      }),
      "name"
    ).map((item) => item.id);

    dispatch(setMasterSchemaSearch({ ...search, filters }));
  };

  const onFilterCancel = () => dispatch(setMasterSchemaSearch({ ...search, filters: [] }));

  const getDateFormat = (date) => {
    const options = { day: "numeric", month: "numeric", year: "numeric" };
    if (date?.length > 1) {
      return date.map((item) => item.toLocaleString("en-CA", options));
    } else {
      return [undefined, undefined];
    }
  };

  const onCalendarChange = (date) => {
    const formattedDate = getDateFormat(date);

    dispatch(setMasterSchemaSearch({ ...search, dates: formattedDate }));
  };

  useDidMount(() => {
    dispatch(getdFormsRequest());

    if (hierarchy?.name) {
      setFilterTypes(
        allDForms.filter((item) => item.groups.filter((group) => group.name === hierarchy.name).length > 0)
      );
    }
  });

  useDidUpdate(() => (isSearchingRef.current = true), [search]);

  useDidUpdate(() => {
    if (isSearchingRef.current) {
      isSearchingRef.current = false;
      (isEmpty(search.value) ? expandable.reset : expandable.expandAll)();
    }
  }, [hierarchy]);

  useDidUpdate(() => void dispatch(getMasterSchemaHierarchyRequest({ id: selectedId })), [search]);

  useDidUpdate(() => {
    if (!isApprovingLoading) {
      dispatch(setUnapprovedMasterSchemaRequest({ id: hierarchy.masterSchemaId }));
    }
  }, [isApprovingLoading]);

  return (
    <ContextTemplate contextTitle="Master Schema" contextName="Organization view">
      <div className="position-relative">
        {!isEmpty(unapproved) && <UnapprovedFieldsComponent fields={unapproved} />}

        <div
          className={hierarchy ? "position-sticky" : ""}
          style={{ top: "0px", left: "0px", backgroundColor: "#f8f8f8" }}
        >
          <SearchAndFilter
            className="ms-search-and-filter"
            placeholder=""
            handleSearch={onSearchSubmit}
            onCancelFilter={onFilterCancel}
            filterTypes={{ applications: filterNames }}
            applyFilter={onFilterSubmit}
            onCalendarChange={onCalendarChange}
            isCalendar
            hasIcon
            filterTabPosition={"left"}
          />

          {hierarchy?.id && (
            <div className="d-flex justify-content-end pb-1">
              <MSEButton
                className="p-0"
                textColor="currentColor"
                backgroundColor="transparent"
                disabled={!expandable.isCollapsable}
                onClick={expandable.reset}
              >
                Collapse
              </MSEButton>
            </div>
          )}
        </div>

        {hierarchy ? (
          <MasterSchemaElements key={hierarchy.name} />
        ) : (
          <h2 className="ms-nothing-was-found">Nothing was found for your query</h2>
        )}
      </div>
    </ContextTemplate>
  );
};

export default MasterSchemaContextComponent;
