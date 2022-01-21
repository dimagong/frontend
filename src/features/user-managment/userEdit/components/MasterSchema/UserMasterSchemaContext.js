import React from "react";
import _ from "lodash/fp";
import { Scrollbars } from "react-custom-scrollbars";
import { useDispatch, useSelector } from "react-redux";

import { INPUT_HEADER_HEIGHT } from "constants/header";

import appSlice from "app/slices/appSlice";
import { selectdForms } from "app/selectors";

import MSEButton from "features/MasterSchema/share/mse-button";

import { useDidMount } from "hooks/use-did-mount";
import { useDidUpdate } from "hooks/use-did-update";

import SearchAndFilter from "components/SearchAndFilter";
import { useTreeHierarchyExpandable } from "components/TreeHierarchy";
import UnapprovedFieldsComponent from "components/UnapprovedFieldsComponent";

import UserMasterSchemaHierarchy from "./UserMasterSchemaHierarchy";
import { UserMasterSchemaProviderContext } from "./UserMasterSchemaProvider";

const { getdFormsRequest } = appSlice.actions;

const useSearch = (hierarchy) => {
  const dispatch = useDispatch();
  const allDForms = useSelector(selectdForms);
  const [filterTypes, setFilterTypes] = React.useState([]);
  const filterNames = React.useMemo(() => filterTypes.map(_.get("name")), [filterTypes]);

  const onSearchSubmit = (searchName) => {
    const searchValue = searchName.hasOwnProperty("target") ? searchName.target.value : searchName;

    hierarchy.setSearchParams({ name: searchValue });
  };

  const onFilterSubmit = (filterOptions, filter) => {
    if (!hierarchy.data) return;

    const filters = _.intersectionBy(
      allDForms.filter((item) => item.groups.filter((group) => group.name === hierarchy.data.name).length > 0),
      filter.applications.map((item) => {
        return { name: item };
      }),
      "name"
    ).map((item) => item.id);

    hierarchy.setSearchParams({ application_ids: filters });
  };

  const onFilterCancel = () => hierarchy.setSearchParams({ application_ids: [] });

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

    hierarchy.setSearchParams({ date_begin: formattedDate[0], date_end: formattedDate[1] });
  };

  useDidMount(() => {
    dispatch(getdFormsRequest());

    if (hierarchy.data?.name) {
      setFilterTypes(
        allDForms.filter((item) => item.groups.filter((group) => group.name === hierarchy.data.name).length > 0)
      );
    }
  });

  return {
    filterNames,
    onSearchSubmit,
    onFilterSubmit,
    onFilterCancel,
    onCalendarChange,
  };
};

const UserMasterSchemaContext = () => {
  const provided = React.useContext(UserMasterSchemaProviderContext);
  const { userMS, selectable, onSelect } = provided;
  const { hierarchy, unapproved, movementOptions } = userMS;
  const expandable = useTreeHierarchyExpandable(hierarchy.data);
  const { filterNames, onSearchSubmit, onFilterSubmit, onFilterCancel, onCalendarChange } = useSearch(hierarchy);

  const onApprove = () => userMS.refresh();

  const onCreatedElement = () => hierarchy.refresh();

  useDidUpdate(() => {
    if (!hierarchy.data || hierarchy.isLoading) return;
    hierarchy.isSearchParamsInitial() ? expandable.expandOnlyRoot() : expandable.expandAll();
  }, [hierarchy]);

  return (
    <Scrollbars autoHeight autoHeightMax={window.innerHeight - INPUT_HEADER_HEIGHT}>
      {unapproved.data && movementOptions.data && !_.isEmpty(unapproved.data) ? (
        <UnapprovedFieldsComponent
          fields={unapproved.data}
          movementOptions={movementOptions.data}
          onApprove={onApprove}
        />
      ) : null}

      <div className="position-relative">
        <div
          className={hierarchy ? "position-sticky zindex-1" : ""}
          style={{ top: "0px", left: "0px", backgroundColor: "#fff" }}
        >
          <SearchAndFilter
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

          {hierarchy && (
            <div className="d-flex justify-content-end pb-1">
              <MSEButton
                className="p-0"
                textColor="currentColor"
                backgroundColor="transparent"
                disabled={!expandable.isDecedentsExpanded}
                onClick={expandable.expandOnlyRoot}
              >
                Collapse
              </MSEButton>
            </div>
          )}
        </div>

        <UserMasterSchemaHierarchy
          hierarchy={hierarchy.data}
          isLoading={hierarchy.isLoading}
          expandedIds={expandable.expandedIds}
          onExpand={expandable.expand}
          onCollapse={expandable.collapse}
          selectedIds={selectable.keys}
          onSelect={onSelect}
          onCreatedElement={onCreatedElement}
        />
      </div>
    </Scrollbars>
  );
};

export default UserMasterSchemaContext;
