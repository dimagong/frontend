import React from "react";
import moment from "moment";
import Scrollbars from "react-custom-scrollbars";
import { CardTitle, Card, CardBody, CardHeader, Collapse } from "reactstrap";

import { useToggle } from "hooks/use-toggle";

import { UITable } from "components/Table";
import ArrowButton from "components/ArrowButton";

const cardTitleStyle = {
  fontSize: "1.2rem",
  color: "#707070",
};

const MSENodeRelatedTable = ({ relatedApplications, ...attrs }) => {
  const [expanded, toggleExpand] = useToggle(true);

  const headers = ["Application Name", "Interaction", "Editor", "$date"];

  return (
    <Card {...attrs} style={{ boxShadow: "none", border: "1px solid #ececec" }}>
      <Scrollbars autoHeight autoHeightMax={300}>
        <CardHeader className="pb-2">
          <div className="w-100 d-flex justify-content-end" style={{ top: "7px", right: "0px" }}>
            <ArrowButton onClick={toggleExpand} direction={expanded ? "down" : "up"} />
          </div>
          <CardTitle className="font-weight-bold" style={cardTitleStyle}>Related applications</CardTitle>
        </CardHeader>

        <Collapse isOpen={expanded} aria-expanded={expanded.toString()}>
          <CardBody className="pt-0">
            <UITable
              headers={headers}
              customHeader={(header) => {
                if (header === "$date") {
                  return <th className="text-right" key={header}>Date</th>;
                }
              }}
              rows={relatedApplications}
              customRow={(relatedApplication) => {
                const { provided_by } = relatedApplication;
                const providedFullName = provided_by ? `${provided_by.first_name} ${provided_by.last_name}` : null;
                return (
                  <tr className="ui-table__row--shadowed" key={relatedApplication.id}>
                    <td>{relatedApplication.application.name}</td>
                    <td>Created</td>
                    <td>{providedFullName ?? "No info"}</td>
                    <td className="text-right ui-table__right-border">
                      <div>{moment(relatedApplication?.field?.date).format("DD/MM/YYYY")}</div>
                      <div>{moment(relatedApplication?.field?.date).format("HH:MM")}</div>
                    </td>
                  </tr>
                );
              }}
            />
          </CardBody>
        </Collapse>
      </Scrollbars>
    </Card>
  );
};

export default MSENodeRelatedTable;
