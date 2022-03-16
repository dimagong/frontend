import "./styles.scss";

import React from "react";
import { Spinner } from "reactstrap";

import NmpButton from "components/nmp/NmpButton";
import { TreeHierarchy } from "components/TreeHierarchy";
import SearchAndFilter from "components/SearchAndFilter";
import ContextTemplate from "components/ContextTemplate";

const RMContextComponent = (props) => {
  const {
    hierarchy,
    onSelect,
    selectedNodes,
    isLoading,
    expandable,
    isElementCreationLoading,
    onElementCreationSubmit,
  } = props;

  if (isLoading) {
    return (
      <ContextTemplate contextTitle="Resource Manager">
        <div className="d-flex justify-content-center pt-5">
          <Spinner color="primary" size="lg" />
        </div>
      </ContextTemplate>
    );
  }

  return (
    <ContextTemplate contextTitle="Resource Manager">
      <div
        className={hierarchy ? "position-sticky zindex-1" : ""}
        style={{ top: "0px", left: "0px", backgroundColor: "#f8f8f8" }}
      >
        <SearchAndFilter
          className="ms-search-and-filter"
          placeholder=""
          handleSearch={() => {}}
          onCancelFilter={() => {}}
          filterTypes={{ applications: [] }}
          applyFilter={() => {}}
          onCalendarChange={() => {}}
          isCalendar
          hasIcon
          filterTabPosition={"left"}
          hideFilter
        />

        {hierarchy && (
          <div className="d-flex justify-content-end pb-1">
            <NmpButton
              className="p-0"
              textColor="currentColor"
              backgroundColor="transparent"
              onClick={expandable.expandOnlyRoot}
            >
              Collapse
            </NmpButton>
          </div>
        )}
      </div>
      <TreeHierarchy
        hierarchy={hierarchy}
        expandedIds={expandable.expandedIds}
        onExpand={expandable.expand}
        onCollapse={expandable.collapse}
        onSelect={onSelect}
        selectedIds={selectedNodes}
        elementCreationLoading={isElementCreationLoading}
        onElementCreationSubmit={onElementCreationSubmit}
      />
    </ContextTemplate>
  );
};

export default RMContextComponent;
