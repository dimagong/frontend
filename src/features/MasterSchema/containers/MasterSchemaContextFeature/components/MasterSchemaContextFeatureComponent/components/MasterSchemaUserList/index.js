import "./styles.scss";

import React, { useState } from "react";

// ToDo: - Make User list UI
// ToDo: - Make User API binding

let userId = 1;
const user = () => ({
  id: userId++,
  firstName: "Alexander",
  lastName: "Shibisty",
  field: {
    value: "InputValue/LongText/FilePath",
    date: "2021-11-10T18:50:53.000000Z",
  },
  permissions: {
    organization: "Rimbal",
    ability: "admin",
  },
  onboardings: ["string"],
  avatar: "filePath",
  avatarPath: "filePath",
  memberFirm: {},
  memberFirmPermissions: ["string"],
});
const MOCK_USERS = [user(), user()];

const MasterSchemaUserList = () => {
  const [users] = useState(MOCK_USERS);

  return (
    <div>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.firstName}</li>
        ))}
      </ul>
    </div>
  );
};

export default MasterSchemaUserList;
