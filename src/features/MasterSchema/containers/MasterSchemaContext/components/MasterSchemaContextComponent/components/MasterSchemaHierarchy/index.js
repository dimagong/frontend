import "./styles.scss";

import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";

import { useTreeData } from "hooks/use-tree";
import { useBoolean } from "hooks/use-boolean";
import { useCallbackOnLoad } from "hooks/common";

import TreeRoot from "components/tree/tree-root";

import SurveyModal from "features/Surveys/Components/SurveyModal";

import appSlice from "app/slices/appSlice";

import MSETreeElement from "./components/mse-tree-element";
import MSETreeNodeList from "./components/mse-tree-node-list";
import MSECreateElementForm from "./components/mse-create-element-form";
import { ADD_FIELD, ADD_GROUP, addFieldAction, addGroupAction } from "./mse-addition-actions";

const { addFieldToMasterSchemaRequest, addGroupToMasterSchemaRequest } = appSlice.actions;

const elementAdditionActionTypes = [addFieldToMasterSchemaRequest.type, addGroupToMasterSchemaRequest.type];

const getKey = ({ nodeId }) => nodeId;

const getChildren =
  (hierarchy) =>
  ({ isContainable, fields, groups }) => {
    return isContainable ? [...fields, ...groups].map((nodeId) => hierarchy.childrenMap.get(nodeId)) : [];
  };

const creationTitle = (type) => {
  switch (type) {
    case ADD_FIELD:
      return "New Element";
    case ADD_GROUP:
      return "New Category";
    default:
      throw new Error("Unexpected element addition type.");
  }
};

const MasterSchemaHierarchy = (props) => {
  const { hierarchy, expandedIds, onExpand, onCollapse, selectedIds, onSelect } = props;

  const dispatch = useDispatch();

  const tree = useTreeData({ items: [hierarchy], getKey, getChildren: getChildren(hierarchy) });

  const [modal, openModal, closeModal] = useBoolean(false);
  const [nodeDataToCreate, setNodeDataToCreate] = useState(null);

  const finishElementCreation = () => {
    closeModal();
    setNodeDataToCreate(null);
  };

  const nodeAdditionLoading = useCallbackOnLoad(elementAdditionActionTypes, finishElementCreation, true);

  const onFieldCreatorClick = (nodeId) => {
    const parent = tree.getItem(nodeId).value;

    openModal();
    setNodeDataToCreate(addFieldAction(parent));
  };

  const onGroupCreatorClick = (nodeId) => {
    const parent = tree.getItem(nodeId).value;

    openModal();
    setNodeDataToCreate(addGroupAction(parent));
  };

  const onCreateElementSubmit = (submitted) => {
    if (submitted.invalid) return;

    const { name } = submitted.values;
    const { parent, type } = nodeDataToCreate;
    const payload = { name, parentId: parent.id };

    switch (type) {
      case ADD_FIELD:
        dispatch(addFieldToMasterSchemaRequest(payload));
        break;
      case ADD_GROUP:
        dispatch(addGroupToMasterSchemaRequest(payload));
        break;
      default:
        throw new Error("Unexpected element addition type.");
    }
  };

  // Tree needs to be updated only when items change. Or it'll cause a stack overflow
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => tree.update([hierarchy]), [hierarchy]);

  return (
    <div className="ms-elements">
      <TreeRoot
        nodes={tree.items}
        renderNodeList={({ root, children }) => <MSETreeNodeList root={root} children={children} />}
        renderNode={({ node: { value: node }, children }) => (
          <MSETreeElement
            node={node}
            selected={selectedIds.includes(node.nodeId)}
            onSelect={() => onSelect(node.nodeId)}
            expanded={expandedIds.includes(node.nodeId)}
            onExpand={() => onExpand(node)}
            onCollapse={() => onCollapse(node)}
            onFieldCreatorClick={() => onFieldCreatorClick(node.nodeId)}
            onGroupCreatorClick={() => onGroupCreatorClick(node.nodeId)}
            children={children}
          />
        )}
      />

      {nodeDataToCreate && (
        <SurveyModal isOpen={modal} title={creationTitle(nodeDataToCreate.type)} onClose={closeModal} actions={false}>
          <MSECreateElementForm
            submitting={nodeAdditionLoading}
            placeholder={nodeDataToCreate.parent.path.join(".")}
            onSubmit={onCreateElementSubmit}
          />
        </SurveyModal>
      )}
    </div>
  );
};

MasterSchemaHierarchy.defaultProps = {
  expandedIds: [],
  selectedIds: [],
};

MasterSchemaHierarchy.propTypes = {
  hierarchy: PropTypes.object.isRequired,

  expandedIds: PropTypes.arrayOf(PropTypes.string),
  onExpand: PropTypes.func,
  onCollapse: PropTypes.func,

  onSelect: PropTypes.func,
  selectedIds: PropTypes.arrayOf(PropTypes.string),
};

export default MasterSchemaHierarchy;
