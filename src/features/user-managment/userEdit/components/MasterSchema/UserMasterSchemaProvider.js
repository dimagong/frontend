import React from "react";
import PropTypes from "prop-types";

import { useMasterSchemaSelectable } from "features/MasterSchema/hooks/useMasterSchemaSelectable";

export const UserMasterSchemaProviderContext = React.createContext();

const UserMasterSchemaProvider = React.memo(({ userId, setContextFeature, children }) => {
  const [selectedNodes, { select: selectNode, clear: resetSelected }] = useMasterSchemaSelectable(
    useMasterSchemaSelectable.Stratagy.OnlySingleField
  );

  const provided = React.useMemo(
    () => ({ userId, selectedNodes, selectNode, resetSelected, setContextFeature }),
    [resetSelected, selectNode, selectedNodes, setContextFeature, userId]
  );

  return <UserMasterSchemaProviderContext.Provider value={provided} children={children} />;
});

UserMasterSchemaProvider.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  setContextFeature: PropTypes.func.isRequired,
};

export default UserMasterSchemaProvider;
