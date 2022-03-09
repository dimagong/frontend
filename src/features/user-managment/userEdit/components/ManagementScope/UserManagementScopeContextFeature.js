import _ from "lodash/fp";
import React from "react";
import { map } from "rxjs";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";

import { useAsync } from "hooks/useAsync";

import appSlice from "app/slices/appSlice";

import { RoleBdmService } from "api/roleBdm/roleBdmService";

import MemberFirmUsersList from "../../../../home/ContextSearch/MemberFirms/Containers/MemberFirmMembersContainer/Components/MemberFirmMembersComponent/Components/MemberFirmUsersList";

const { setContext, setManager } = appSlice.actions;

const fetchBdmSubordinates$ = ({ userId }) =>
  RoleBdmService.getBdmSubordinates$({ userId }).pipe(map((response) => response.data));

const UserManagementScopeContextFeature = React.memo(({ user }) => {
  const dispatch = useDispatch();
  const [{ data: members, IsLoading: isMembersLoading }, run] = useAsync({ useObservable: true });

  const onNavigateToUserProfile = () => {
    dispatch(setContext(null));
    setTimeout(() => {
      dispatch(setManager(user));
      dispatch(setContext("User"));
    });
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => void run(fetchBdmSubordinates$({ userId: user.id })).subscribe(), [user.id]);

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
        isLoading={isMembersLoading}
        isSearch={false}
        onUserClick={onNavigateToUserProfile}
      />
    </div>
  );
});

UserManagementScopeContextFeature.propTypes = {
  user: PropTypes.object.isRequired,
};

export default UserManagementScopeContextFeature;
