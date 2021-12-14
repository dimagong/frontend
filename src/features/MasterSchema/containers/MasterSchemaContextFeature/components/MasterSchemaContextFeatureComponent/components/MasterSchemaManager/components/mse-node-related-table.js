import '../../MasterSchemaUserList/styles.scss';
import React  from "react";
import {CardTitle, Label, Table, Card, CardBody, CardHeader} from "reactstrap";
import moment from "moment";

const MSENodeRelatedTable = ({ relatedApplications, ...attrs }) => {
  return (
    <Card className={'my-2'}>
      <CardHeader>
        <Label for={'px-0'}>
          <CardTitle>Related applications</CardTitle>
        </Label>
      </CardHeader>
    <CardBody className="pt-0 pb-1 px-0">
          <Table className="msu-related-table msu-table" borderless responsive>
            <thead>
              <tr>
                <th className="msu-table__name">Application Name</th>
                <th>Interaction</th>
                <th>Editor</th>
                <th className="msu-table__date">Date</th>
              </tr>
            </thead>
            <tbody>
              {relatedApplications.map((currRelated) => {
                return (
                  <tr key={currRelated.id}>
                    <td className="msu-table__name">{currRelated.application.name}</td>

                    <td>Created</td>
                    <td>{currRelated.provided_by ?? 'No info'}</td>
                    <td className="msu-table__date msu-related-table__date">
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
