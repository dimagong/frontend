import { useSelector } from "react-redux";
import { get, pipe, isEqual } from "lodash/fp";
import React, { useEffect, useMemo } from "react";

import { useToggleable } from "hooks/use-toggleable";

import * as masterSchemaSelectors from "app/selectors/masterSchemaSelectors";

import MasterSchemaContext from "./containers/MasterSchemaContext";
import MasterSchemaContextFeature from "./containers/MasterSchemaContextFeature";

const predicatesToKey = (key) => pipe(get("key"), isEqual(key));

const MasterSchema = () => {
  const selectable = useToggleable([]);

  const selectedId = useSelector(masterSchemaSelectors.selectSelectedId);
  const hierarchy = useSelector(masterSchemaSelectors.selectSelectedHierarchy);
  const unapproved = useSelector(masterSchemaSelectors.selectSelectedUnapproved);

  const selected = useMemo(() => {
    const nodes = [hierarchy, ...hierarchy.children];
    const findNodeByKey = (key) => nodes.find(predicatesToKey(key));
    const selectedNodes = selectable.keys.map(findNodeByKey).filter(Boolean);
    const fields = selectedNodes.filter(pipe(get("isContainable"), (v) => !v));
    const groups = selectedNodes.filter(get("isContainable"));

    return { nodes: selectedNodes, fields, groups, node: selectedNodes[0], field: fields[0], group: groups[0] };
  }, [hierarchy, selectable.keys]);
  const state = useMemo(
    () => ({ selectable, selected, hierarchy, unapproved }),
    [hierarchy, selectable, selected, unapproved]
  );

  // clear selectable for diff master schemas
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void selectable.clear(), [selectedId]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    selectable.clear();
    // ToDo: reselect on changes in hierarchy
    // state.masterSchema.selectedNodes = state.masterSchema.selectedNodes.map((key) =>
    //   key === oldGroup.key ? valid.key : key
    // );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hierarchy]);

  return (
    <div className="d-flex">
      <MasterSchemaContext state={state} />
      <MasterSchemaContextFeature state={state} />
    </div>
  );
};

export default MasterSchema;
