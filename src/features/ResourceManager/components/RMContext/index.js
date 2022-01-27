import React from 'react';

import ContextTemplate from "components/ContextTemplate";

import { TreeHierarchy } from "components/TreeHierarchy";

import './styles.scss';
import SearchAndFilter from "../../../../components/SearchAndFilter";
import MSEButton from "../../../MasterSchema/share/mse-button";
import { Spinner } from 'reactstrap';

const RMContextComponent = ({
  hierarchy,
  onSelect,
  selectedNodes,
  isLoading,
  expandable,
  isElementCreationLoading,
  onElementCreationSubmit,
}) => {

  if (isLoading) {
    return (
      <ContextTemplate contextTitle="Resource Manager">
        <div className="d-flex justify-content-center pt-5">
          <Spinner color="primary" size="lg" />
        </div>
      </ContextTemplate>
    )
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
        />

        {hierarchy && (
          <div className="d-flex justify-content-end pb-1">
            <MSEButton
              className="p-0"
              textColor="currentColor"
              backgroundColor="transparent"
              onClick={expandable.expandOnlyRoot}
            >
              Collapse
            </MSEButton>
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
