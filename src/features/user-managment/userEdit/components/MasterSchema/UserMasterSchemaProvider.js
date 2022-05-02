import React from "react";
import PropTypes from "prop-types";

import { useMasterSchemaSelectable } from "features/MasterSchema/hooks/useMasterSchemaSelectable";

export const UserMasterSchemaProviderContext = React.createContext();

const UserMasterSchemaProvider = React.memo(({ user, setContextFeature, children }) => {
  const [selectedNodes, { select: selectNode, clear: resetSelected }] = useMasterSchemaSelectable(
    useMasterSchemaSelectable.Stratagy.OnlySingleField
  );

  const provided = React.useMemo(
    () => ({ user, selectedNodes, selectNode, resetSelected, setContextFeature }),
    [resetSelected, selectNode, selectedNodes, setContextFeature, user]
  );

  return (
    <React.Profiler
      id="user-master-schema-provider"
      onRender={(id, phase) => console.log(id, phase, { selectedNodes })}
    >
      <UserMasterSchemaProviderContext.Provider value={provided} children={children} />
    </React.Profiler>
  );
});

UserMasterSchemaProvider.propTypes = {
  user: PropTypes.object.isRequired,
  setContextFeature: PropTypes.func.isRequired,
};

export default UserMasterSchemaProvider;
