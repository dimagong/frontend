import React from "react";
import _ from "lodash/fp";
import { Scrollbars } from "react-custom-scrollbars";
import { useDispatch, useSelector } from "react-redux";

import { INPUT_HEADER_HEIGHT } from "constants/header";

import appSlice from "app/slices/appSlice";
import { selectdForms } from "app/selectors";

import { useDidMount } from "hooks/use-did-mount";

import MSEButton from "features/MasterSchema/share/mse-button";

import SearchAndFilter from "components/SearchAndFilter";
import UnapprovedFieldsComponent from "components/UnapprovedFieldsComponent";
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

  const onFilterSubmit = (filter) => {
    if (!hierarchy.data) return;

    debugger;
    const a = allDForms.filter((item) => item.groups.filter((group) => group.name === hierarchy.data.name).length > 0);
    // const b1 = filter.selectedFilters.find(item => item.name === 'applications');
    const b1 = filter.selectedFilters.find(_.pipe(_.get("name"), _.isEqual("applications")));
    const b2 = b1.selected;
    const b3 = b2.map((item) => ({ name: item }));

    const intersected = _.intersectionBy(a, b3, "name");
    const filters = intersected.map(_.get("id"));

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
  const { userMS, userId, selectable, onSelect } = React.useContext(UserMasterSchemaProviderContext);
  const { hierarchy, unapproved, movementOptions } = userMS;

  const search = useSearch(userMS.hierarchy);
  const expandable = useTreeHierarchyExpandable(hierarchy.data);

  const onApproveSubmit = ({ parentId, fieldsIds }) => {
    userMS.approveUnapproved({ parentId, fieldsIds });
  };

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
    if (!userMS.hierarchy.data || hierarchy.isLoading) return;
    hierarchy.isSearchParamsInitial() ? expandable.expandOnlyRoot() : expandable.expandAll();
    // expandable contains a state
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hierarchy.searchParams]);

  return (
    <Scrollbars autoHeight autoHeightMax={window.innerHeight - INPUT_HEADER_HEIGHT}>
      <div className="position-relative zindex-2">
        {unapproved.data && movementOptions.data && !_.isEmpty(unapproved.data) ? (
          <UnapprovedFieldsComponent
            fields={unapproved.data}
            movementOptions={movementOptions.data}
            onApproveSubmit={onApproveSubmit}
          />
        ) : null}
      </div>

      <div className="position-relative">
        <div
          className={hierarchy ? "position-sticky zindex-1" : ""}
          style={{ top: "0px", left: "0px", backgroundColor: "#fff" }}
        >
          <SearchAndFilter
            placeholder=""
            handleSearch={search.onSearchSubmit}
            onCancelFilter={search.onFilterCancel}
            filterTypes={{ applications: search.filterNames, types: ["Files only"] }}
            applyFilter={search.onFilterSubmit}
            onCalendarChange={search.onCalendarChange}
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
          elementCreationLoading={userMS.elementCreationLoading}
          onElementCreationSubmit={onElementCreationSubmit}
        />
      </div>
    </Scrollbars>
  );
};

export default UserMasterSchemaContext;
