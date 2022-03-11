import React from 'react';

import UserCardTemplate from "../../../../../../../CardTemplates/userCard";
import { Spinner } from "reactstrap";

import './styles.scss';


const MemberFirmUsersList = ({ className, label, users = [], titleForEmpty, isLoading, isSearch, onUserClick }) => {

  const Loader = () => (
    <div className="member-firm-users-list_list_loader">
      <Spinner color="primary" size={40} />
    </div>
  );

  const renderList = () => (
     users.length ? (
       users.map(user => (
         <UserCardTemplate
           className="cursor-pointer mb-2"
           oneColumn={false}
           onClick={() => {onUserClick(user)}}
           {...user}
         />
       ))
     ) : (
       <div className="member-firm-users-list_list_no-members">
         {isSearch ? (
           `No ${label} found for your search query`
         ) : (
           titleForEmpty ? titleForEmpty : `There are no ${label} in that member firm`
         )}
       </div>
     )
  );

  return (
    <div className={`member-firm-users-list ${className}`}>
      <div className="member-firm-users-list_label">
        {label}
      </div>
      <div className="member-firm-users-list_list">
        {isLoading ? (
          <Loader />
        ) : (
          renderList()
        )}
      </div>
    </div>
  )
};

export default MemberFirmUsersList;
