import React from "react";
import PropTypes from "prop-types";

import { useDidUpdate } from "hooks/use-did-update";
import { useTreeHierarchySelectable } from "components/TreeHierarchy";

import { useUserMasterSchema } from "./useUserMasterSchema";

export const UserMasterSchemaProviderContext = React.createContext();

const UserMasterSchemaProvider = ({ userId, setContextFeature, children }) => {
  const userMS = useUserMasterSchema(userId);
  const selectable = useTreeHierarchySelectable(userMS.hierarchy.data, useTreeHierarchySelectable.STRATEGY.OnlyField);

  const onSelect = React.useCallback(
    (node) => {
      setContextFeature();
      selectable.toggle(node.nodeId);
    },
    [selectable, setContextFeature]
  );

  const value = React.useMemo(() => ({ userId, userMS, selectable, onSelect }), [userId, userMS, selectable, onSelect]);

  useDidUpdate(() => selectable.clear(), [userId]);

  return <UserMasterSchemaProviderContext.Provider value={value} children={children} />;
};

UserMasterSchemaProvider.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  setContextFeature: PropTypes.func.isRequired,
};

export default UserMasterSchemaProvider;
