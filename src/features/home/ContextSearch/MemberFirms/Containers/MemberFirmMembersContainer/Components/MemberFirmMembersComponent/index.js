import React from 'react';

import ContextFeatureTemplate from "components/ContextFeatureTemplate";

import { Button } from 'reactstrap'
import {Settings} from 'react-feather';
import UserCardTemplate from "../../../../../CardTemplates/userCard";
import "./styles.scss"


const userCardUserTemplateData = {
  first_name: "Jane",
  last_name: "Doe",

  email: "jane.doe@citycapital.co.uk",
  number: "+49 332 423 2344",

  permissions: {
    organization: "Rimbal",
    ability: "Advisor",
  }
};

const MemberFirmUsersList = ({ className, label, users = [] }) => {



  return (
    <div className={`member-firm-users-list ${className}`}>
      <div className="member-firm-users-list_label">
        {label}
      </div>
      <div className="member-firm-users-list_list">
        {users.map(user => (
          <UserCardTemplate
            className="cursor-pointer mb-2"
            oneColumn={false}
            onClick={() => {}}
            {...user}
          />
        ))}
      </div>
    </div>
  )
};

const MemberFirmMembersComponent = () => {

  const principals = Array.from(Array.from({length: 2}), () => userCardUserTemplateData);
  const members = Array.from(Array.from({length: 3}), () => userCardUserTemplateData);

  return (
    <ContextFeatureTemplate contextFeatureTitle="Associated members" isSearchEnabled onSearchValueChange={() => {}} searchValue={""}>
      <div className="member-firm-associated-members">

        <MemberFirmUsersList
          className={"principals"}
          users={principals}
          label="Principals"
        />

        <MemberFirmUsersList
          className={"members"}
          users={members}
          label="Members"
        />

      </div>

      <Button className="member-firm-associated-members_settings-button" color="primary">
        <Settings />
      </Button>
    </ContextFeatureTemplate>
  )
};

export default MemberFirmMembersComponent;
