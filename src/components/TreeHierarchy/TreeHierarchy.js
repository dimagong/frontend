import "./styles.scss";

import _ from "lodash/fp";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";

import { useTreeData } from "hooks/use-tree";
import { useBoolean } from "hooks/use-boolean";
import { useCallbackOnLoad } from "hooks/common";

import appSlice from "app/slices/appSlice";
import TreeRoot from "components/tree/tree-root";
import SurveyModal from "features/Surveys/Components/SurveyModal";

import MSHTreeElement from "./components/MSHTreeElement";
import MSHTreeNodeList from "./components/MSHTreeNodeList";
import MSHCreateElementForm from "./components/MSHCreateElementForm";
import { ADD_FIELD, ADD_GROUP, addFieldAction, addGroupAction } from "./NodeAdditionActions";

const { addFieldToMasterSchemaRequest, addGroupToMasterSchemaRequest } = appSlice.actions;

const elementAdditionActionTypes = [addFieldToMasterSchemaRequest.type, addGroupToMasterSchemaRequest.type];

const getKey = ({ nodeId }) => nodeId;

const getChildren =
  (hierarchy) =>
  ({ isContainable, fields, groups }) => {
    return isContainable ? [...fields, ...groups].map((nodeId) => hierarchy.children[nodeId]) : [];
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

const defaultComponents = {
  Element: MSHTreeElement,
  NodeList: MSHTreeNodeList,
  CreateElementForm: MSHCreateElementForm,
};

const TreeHierarchy = (props) => {
  const {
    hierarchy,
    expandedIds,
    onExpand,
    onCollapse,
    selectedIds,
    onSelect,
    components: propComponents,
    ...wrapperAttrs
  } = props;
  const components = _.merge(propComponents, defaultComponents);

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
    <div className="tree-hierarchy" {...wrapperAttrs}>
      <TreeRoot
        nodes={tree.items}
        renderNodeList={({ root, children }) => <components.NodeList root={root} children={children} />}
        renderNode={({ node: { value: node }, children }) => (
          <components.Element
            node={node}
            selected={selectedIds.includes(node.nodeId)}
            onSelect={() => onSelect(node)}
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
          <components.CreateElementForm
            submitting={nodeAdditionLoading}
            placeholder={nodeDataToCreate.parent.path.join(".")}
            onSubmit={onCreateElementSubmit}
          />
        </SurveyModal>
      )}
    </div>
  );
};

TreeHierarchy.defaultProps = {
  expandedIds: [],
  selectedIds: [],

  components: defaultComponents,
};

TreeHierarchy.propTypes = {
  hierarchy: PropTypes.object.isRequired,

  expandedIds: PropTypes.arrayOf(PropTypes.string),
  onExpand: PropTypes.func,
  onCollapse: PropTypes.func,

  onSelect: PropTypes.func,
  selectedIds: PropTypes.arrayOf(PropTypes.string),

  components: PropTypes.object,
};

export default TreeHierarchy;
