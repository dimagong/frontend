import React from "react";
import PropTypes from "prop-types";

import { useTreeHierarchySelectable } from "components/TreeHierarchy";

import { useUserMasterSchemaHierarchy } from "./useUserMasterSchemaHierarchy";
import { useUserMasterSchemaUnapproved } from "./useUserMasterSchemaUnapproved";
import { useMasterSchemaMovementOptions } from "./useMasterSchemaMovementOptions";

export const UserMasterSchemaProviderContext = React.createContext();

const useUserMS = (userId) => {
  const hierarchy = useUserMasterSchemaHierarchy(userId);
  const unapproved = useUserMasterSchemaUnapproved(hierarchy.data?.masterSchemaId);
  const movementOptions = useMasterSchemaMovementOptions(hierarchy.data?.masterSchemaId);

  const refresh = () => {
    hierarchy.refresh();
    unapproved.refresh();
    movementOptions.refresh();
  };

  return {
    hierarchy,
    unapproved,
    movementOptions,
    refresh,
  };
};

const UserMasterSchemaProvider = ({ userId, setContextFeature, children }) => {
  const userMS = useUserMS(userId);
  const selectable = useTreeHierarchySelectable(userMS.hierarchy.data);

  const onSelect = React.useCallback(
    (node) => {
      setContextFeature();
      selectable.toggle(node.nodeId);
    },
    [selectable, setContextFeature]
  );

  const value = React.useMemo(
    () => ({ userId, userMS, selectable, onSelect }),
    [userId, userMS, selectable, onSelect]
  );

  return <UserMasterSchemaProviderContext.Provider value={value} children={children} />;
};

UserMasterSchemaProvider.propTypes = {
  userId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  setContextFeature: PropTypes.func.isRequired,
};

export default UserMasterSchemaProvider;
