import "../../MasterSchemaUserList/styles.scss";

import React from "react";
import moment from "moment";
import { CardTitle, Table, Card, CardBody, CardHeader } from "reactstrap";

const MSENodeRelatedTable = ({ relatedApplications, ...attrs }) => {
  return (
    <Card {...attrs} style={{ boxShadow: "none", border: "1px solid #ececec" }}>
      <CardHeader>
        <CardTitle className="ms-manager__label">Related applications</CardTitle>
      </CardHeader>
      <CardBody>
        <Table className="msu-related-table msu-table" borderless responsive>
          <thead>
            <tr className="msu-table__users-head">
              <th className="msu-table__name">Application Name</th>
              <th>Interaction</th>
              <th>Editor</th>
              <th className="msu-table__date">Date</th>
            </tr>
          </thead>
          <tbody>
            {relatedApplications.map((currRelated) => {
              return (
                <tr className="msu-table__row--shadowed" key={currRelated.id}>
                  <td className="msu-table__name">{currRelated.application.name}</td>
                  <td>Created</td>
                  <td>{currRelated.provided_by ?? "No info"}</td>
                  <td className="msu-table__date--end">
                    <div>{moment(currRelated?.field?.date).format("DD/MM/YYYY")}</div>
                    <div>{moment(currRelated?.field?.date).format("HH:MM")}</div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </CardBody>
    </Card>
  );
};

export default MSENodeRelatedTable;
