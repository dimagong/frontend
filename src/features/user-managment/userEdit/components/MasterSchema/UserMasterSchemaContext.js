import React from "react";
import _ from "lodash/fp";
import { Scrollbars } from "react-custom-scrollbars";
import { useDispatch, useSelector } from "react-redux";

import { INPUT_HEADER_HEIGHT } from "constants/header";

import appSlice from "app/slices/appSlice";
import { selectdForms } from "app/selectors";

import MSEButton from "features/MasterSchema/share/mse-button";

import SearchAndFilter from "components/SearchAndFilter";
import { ADD_FIELD, ADD_GROUP, useTreeHierarchyExpandable } from "components/TreeHierarchy";

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

  const onFilterSubmit = (filter, filterHierarchy) => {
    if (!filterHierarchy) return;

    const dFormNames = allDForms.filter(
      (item) => item.groups.filter((group) => group.name === filterHierarchy.name).length > 0
    );
    const selectedApplications = filter.selectedFilters.find(_.pipe(_.get("name"), _.isEqual("applications"))).selected;
    const selectedApplicationsNames = selectedApplications.map((item) => ({ name: item }));
    const intersectedApplicationNames = _.intersectionBy("name", dFormNames, selectedApplicationsNames);
    const selectedApplicationIds = intersectedApplicationNames.map(_.get("id"));

    const selectedTypes = filter.selectedFilters.find(_.pipe(_.get("name"), _.isEqual("types"))).selected;
    const onlyFiles = selectedTypes.includes("Files only");

    hierarchy.setSearchParams({ application_ids: selectedApplicationIds, only_files: onlyFiles });
  };

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

  React.useEffect(() => {
    if (!hierarchy.data) return;

    dispatch(getdFormsRequest());

    setFilterTypes(
      allDForms.filter((item) => item.groups.filter((group) => group.name === hierarchy.data.name).length > 0)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hierarchy.data]);

  return {
    filterNames,
    onSearchSubmit,
    onFilterSubmit,
    onCalendarChange,
  };
};

const UserMasterSchemaContext = () => {
  const { userMS, userId, selectable, onSelect } = React.useContext(UserMasterSchemaProviderContext);
  const { hierarchy } = userMS;

  const search = useSearch(userMS.hierarchy);
  const expandable = useTreeHierarchyExpandable(hierarchy.data);

  const onElementCreationSubmit = ({ type, ...creationData }) => {
    switch (type) {
      case ADD_FIELD:
        userMS.createField(creationData);
        break;
      case ADD_GROUP:
        userMS.createGroup(creationData);
        break;
      default:
        throw new Error("Unexpected element addition type.");
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => void userMS.fetch(), [userId]);

  React.useEffect(() => {
    if (!hierarchy.data || hierarchy.isLoading) return;
    hierarchy.isSearchParamsInitial() ? expandable.expandOnlyRoot() : expandable.expandAll();
    // expandable contains a state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hierarchy.data, hierarchy.isLoading, hierarchy.searchParams]);

  return (
    <Scrollbars autoHeight autoHeightMin={550} autoHeightMax={window.innerHeight - INPUT_HEADER_HEIGHT}>
      <div className="position-relative">
        <div
          className={hierarchy ? "position-sticky zindex-1" : ""}
          style={{ top: "0px", left: "0px", backgroundColor: "#fff" }}
        >
          <SearchAndFilter
            placeholder=""
            handleSearch={search.onSearchSubmit}
            filterTypes={{ applications: search.filterNames, types: ["Files only"] }}
            applyFilter={search.onFilterSubmit}
            onCalendarChange={search.onCalendarChange}
            isCalendar
            hasIcon
            filterTabPosition={"left"}
            crossSelectingDisabled
            dataToFilter={userMS.hierarchy.data}
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
          elementCreationLoading={userMS.elementCreationLoading}
          onElementCreationSubmit={onElementCreationSubmit}
        />
      </div>
    </Scrollbars>
  );
};

export default UserMasterSchemaContext;
