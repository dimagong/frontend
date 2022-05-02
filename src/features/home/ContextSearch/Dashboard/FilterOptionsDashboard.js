import React from "react";
import { Button } from "reactstrap";

const FilterOptionsDashboard = ({ currTab, list, filter, setFilter, isSnapshot }) => {
  const handleAddFilterOption = (option) => {
    let newFilter = { ...filter };
    if (filter[currTab].findIndex((curr) => curr.name === option.name) === -1) {
      if (currTab === "Application" && !isSnapshot) {
        newFilter[currTab] = [option];
      } else {
        newFilter[currTab] = [...newFilter[currTab], option];
      }
    } else {
      newFilter[currTab] = newFilter[currTab].filter((item) => item.name !== option.name);
    }
    setFilter(newFilter);
  };
  return (
    <span>
      {list.map((item) => (
        <Button className={"filter-option not-active"} variant="primary">
          <span style={{ width: 180 }} className={"filter-name"}>
            {item.name}
          </span>
          <span className={"filter-right"}>
            <span>
              <span
                className={"filter-check"}
                onClick={() => {
                  handleAddFilterOption(item);
                }}
              >
                <svg
                  style={
                    filter[currTab].findIndex((curr) => curr.name === item.name) !== -1
                      ? { fill: "#7367f0", whiteSpace: "pre", borderRadius: "6px" }
                      : { fill: "#95989a", whiteSpace: "pre", borderRadius: "6px" }
                  }
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 11 12"
                  width="14"
                  height="14"
                >
                  <path
                    id="checkbox-checked"
                    fillRule="evenodd"
                    className="shp0"
                    d="M10.88 2.15L10.88 9.85C10.88 10.55 10.3 11.13 9.6 11.13L1.9 11.13C1.2 11.13 0.62 10.55 0.62 9.85L0.62 2.15C0.62 1.45 1.2 0.87 1.9 0.87L9.6 0.87C10.3 0.87 10.88 1.45 10.88 2.15ZM5.11 8.83L9.09 4.85L8.18 3.94L5.11 7.02L3.64 5.55L2.73 6.45L5.11 8.83Z"
                  />
                </svg>
              </span>
            </span>
          </span>
        </Button>
      ))}
    </span>
  );
};

export default FilterOptionsDashboard;
