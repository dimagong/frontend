import "../../MasterSchemaUser/styles.scss";

import React from "react";
import moment from "moment";
import Scrollbars from "react-custom-scrollbars";
import { CardTitle, Table, Card, CardBody, CardHeader } from "reactstrap";

const MSENodeRelatedTable = ({ relatedApplications, ...attrs }) => {
  return (
    <Card {...attrs} style={{ boxShadow: "none", border: "1px solid #ececec" }}>
      <Scrollbars autoHeight autoHeightMax={300}>
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
              <th className="msu-table__date--end">Date</th>
            </tr>
          </thead>
          <tbody>
            {relatedApplications.map((currRelated) => {
              const { provided_by } = currRelated;
              const providedFullName = provided_by ? `${provided_by.first_name} ${provided_by.last_name}` : null;
              return (
                <tr className="msu-table__row--shadowed" key={currRelated.id}>
                  <td className="msu-table__name">{currRelated.application.name}</td>
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
      </Scrollbars>
    </Card>
  );
};

export default MSENodeRelatedTable;
