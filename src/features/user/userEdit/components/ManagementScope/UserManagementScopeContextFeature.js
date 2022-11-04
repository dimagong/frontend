import React from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import appSlice from "app/slices/appSlice";

import MemberFirmUsersList from "../../../../home/ContextSearch/MemberFirms/Containers/MemberFirmMembersContainer/Components/MemberFirmMembersComponent/Components/MemberFirmUsersList";

const { setContext, setManager } = appSlice.actions;

const UserManagementScopeContextFeature = React.memo(({ user, members, isLoading }) => {
  const dispatch = useDispatch();

  const onNavigateToUserProfile = () => {
    dispatch(setContext(null));
    setTimeout(() => {
      dispatch(setManager(user));
      dispatch(setContext("User"));
    });
  };

  return (
    <div className="context-feature-template_container">
      <div className="context-feature-template_header">
        <h2 className="context-feature-template_header_title">Management scope</h2>
      </div>

      <MemberFirmUsersList
        className="members"
        users={members || []}
        label={`Users currently managed by ${user.first_name} ${user.last_name}`}
        titleForEmpty={`There are no currently managed users by ${user.first_name} ${user.last_name}`}
        isLoading={isLoading}
        isSearch={false}
        onUserClick={onNavigateToUserProfile}
      />
    </div>
  );
});

UserManagementScopeContextFeature.propTypes = {
  user: PropTypes.object.isRequired,
  members: PropTypes.arrayOf(PropTypes.object),
  isLoading: PropTypes.bool,
};

export default UserManagementScopeContextFeature;
