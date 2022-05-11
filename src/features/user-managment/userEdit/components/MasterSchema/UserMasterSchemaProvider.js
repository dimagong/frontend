import React, { memo } from "react";
import PropTypes from "prop-types";

import { useMasterSchemaSelectable } from "features/MasterSchema/hooks/useMasterSchemaSelectable";

export const UserMasterSchemaProviderContext = React.createContext();

const UserMasterSchemaProvider = memo(function UserMasterSchemaProvider({ user, setContextFeature, children }) {
  const [selectedNodes, { select: selectNode, clear: resetSelected }] = useMasterSchemaSelectable(
    useMasterSchemaSelectable.Stratagy.OnlySingleField
  );

  const provided = React.useMemo(
    () => ({ user, selectedNodes, selectNode, resetSelected, setContextFeature }),
    [resetSelected, selectNode, selectedNodes, setContextFeature, user]
  );

  return <UserMasterSchemaProviderContext.Provider value={provided} children={children} />;
});

UserMasterSchemaProvider.propTypes = {
  user: PropTypes.object.isRequired,
  setContextFeature: PropTypes.func.isRequired,
};

export default UserMasterSchemaProvider;
