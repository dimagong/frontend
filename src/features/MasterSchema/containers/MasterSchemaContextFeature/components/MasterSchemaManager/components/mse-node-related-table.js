import "../../MasterSchemaUser/styles.scss";

import React from "react";
import moment from "moment";
import Scrollbars from "react-custom-scrollbars";
import { CardTitle, Table, Card, CardBody, CardHeader, Collapse } from "reactstrap";

import { useToggle } from "hooks/use-toggle";
import ArrowButton from "components/ArrowButton";

const MSENodeRelatedTable = ({ relatedApplications, ...attrs }) => {
  const [expanded, toggleExpand] = useToggle(true);

  return (
    <Card {...attrs} style={{ boxShadow: "none", border: "1px solid #ececec" }}>
      <Scrollbars autoHeight autoHeightMax={300}>
        <CardHeader className="pb-2">
          <div className="w-100 d-flex justify-content-end" style={{ top: "7px", right: "0px" }}>
            <ArrowButton onClick={toggleExpand} direction={expanded ? "down" : "up"} />
          </div>
          <CardTitle className="ms-manager__label">Related applications</CardTitle>
        </CardHeader>

        <Collapse isOpen={expanded} aria-expanded={expanded.toString()}>
          <CardBody className="pt-0">
            <Table className="msu-related-table msu-table" borderless responsive>
              <thead>
                <tr className="msu-table__users-head">
                  <th>Application Name</th>
                  <th>Interaction</th>
                  <th>Editor</th>
                  <th className="msu-table__date--end">Date</th>
                </tr>
              </thead>
              <tbody>
                {relatedApplications.map((currRelated) => {
                  const { provided_by } = currRelated;
                  const providedFullName = provided_by ? `${provided_by.first_name} ${provided_by.last_name}` : null;
                  return (
                    <tr className="msu-table__row--shadowed" key={currRelated.id}>
                      <td>{currRelated.application.name}</td>
                      <td>Created</td>
                      <td>{providedFullName ?? "No info"}</td>
                      <td className="msu-table__date--end msu-table__date--bordered">
                        <div>{moment(currRelated?.field?.date).format("DD/MM/YYYY")}</div>
                        <div>{moment(currRelated?.field?.date).format("HH:MM")}</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </CardBody>
        </Collapse>
      </Scrollbars>
    </Card>
  );
};

export default MSENodeRelatedTable;
