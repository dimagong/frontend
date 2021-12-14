import '../../MasterSchemaUserList/styles.scss';
import React, { useMemo } from "react";
import {get, pipe, isEqual, capitalize} from "lodash/fp";
import {CardTitle, Label, Row, Col, Table, Card, CardBody, CardHeader} from "reactstrap";
import NoneAvatar from "assets/img/portrait/none-avatar.png";
import moment from "moment";

const MSENodeRelatedTable = ({ users, ...attrs }) => {

  return (
    <Card className={'my-2'}>
      <CardHeader>
        <Label for={'px-0'}>
          <CardTitle>Related applications</CardTitle>
        </Label>
      </CardHeader>
    <CardBody className="pt-0 pb-1 px-0">
          <Table className="msu-table" borderless responsive>
            <thead>
              <tr>
                <th className="msu-table__name">Application Name</th>
                <th>Interaction</th>
                <th>Editor</th>
                <th className="msu-table__date">Date</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const avatarPath = user.avatar_path || NoneAvatar;
                const fullName = `${user.first_name} ${user.last_name}`;
                const organization = user?.permissions?.organization;
                const role = capitalize(user?.permissions?.ability);
                const memberFirm = user.member_firm?.main_fields.name;
                const fieldType = capitalize(user.field.type || "");
                const fieldValue = undefined;

                return (
                  <tr key={user.id}>
                    <td className="msu-table__avatar">
                      <img
                        className="msu-table__avatar-img"
                        src={avatarPath}
                        width="40"
                        height="40"
                        alt="user's avatar."
                      />
                    </td>

                    <td className="msu-table__name">{fullName}</td>

                    <td>{organization}</td>
                    <td>{role}</td>
                    <td>{memberFirm}</td>
                    <td className="msu-table__value">
                      smth
                    </td>
                    <td className="msu-table__date">
                      <div>{moment(user.field.date).format("DD/MM/YYYY")}</div>
                      <div>{moment(user.field.date).format("HH:MM")}</div>
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

/*MSENodeRelatedTable.defaultProps = {
  submitting: false,
};

MSENodeRelatedTable.propTypes = {
  node: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  submitting: PropTypes.bool,
  onSubmit: PropTypes.func.isRequired,
};*/

export default MSENodeRelatedTable;
