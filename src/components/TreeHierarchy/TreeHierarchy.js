import "./styles.scss";

import _ from "lodash/fp";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";

import { useTreeData } from "hooks/use-tree";
import { useBoolean } from "hooks/use-boolean";

import TreeRoot from "components/tree/tree-root";

import MSHTreeElement from "./components/MSHTreeElement";
import MSHTreeNodeList from "./components/MSHTreeNodeList";
import MSHCreateElementForm from "./components/MSHCreateElementForm";
import { ADD_FIELD, ADD_GROUP, addFieldAction, addGroupAction } from "./NodeAdditionActions";
import { NmpModal } from "features/nmp-ui";

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
    elementCreationLoading,
    onElementCreationSubmit,
    components: propComponents,
    onFieldCreatorClickProp,
    CreateApplicationForm,
    onFieldCreatingSubmit,
    ...wrapperAttrs
  } = props;
  const components = _.merge(defaultComponents, propComponents);

  const tree = useTreeData({ items: [hierarchy], getKey, getChildren: getChildren(hierarchy) });

  const [modal, openModal, closeModal] = useBoolean(false);
  const [nodeDataToCreate, setNodeDataToCreate] = useState(null);

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
    const name = submitted.values?.name || submitted.name;

    const { parent, type } = nodeDataToCreate;

    onElementCreationSubmit({ type, name, parentId: parent.id });
  };

  // Tree needs to be updated only when items change. Or it'll cause a stack overflow
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => tree.update([hierarchy]), [hierarchy]);

  React.useEffect(() => {
    if (!elementCreationLoading) {
      closeModal();
      setNodeDataToCreate(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elementCreationLoading]);

  const getForm = () => {
    if (!CreateApplicationForm) return <components.CreateElementForm onSubmit={onCreateElementSubmit} />;

    if (nodeDataToCreate?.type === ADD_GROUP) {
      return <components.CreateElementForm onSubmit={onCreateElementSubmit} />;
    }

    return <CreateApplicationForm parent={nodeDataToCreate?.parent} onSubmit={onFieldCreatingSubmit} visible={modal} />;
  };

  const form = getForm();

  return (
    <div className="tree-hierarchy" {...wrapperAttrs}>
      <TreeRoot
        nodes={tree.items}
        renderNodeList={({ root, index, children }) => (
          <components.NodeList root={root} index={index} children={children} />
        )}
        renderNode={({ index, node: { value: node }, children }) => (
          <components.Element
            node={node}
            index={index}
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
        <NmpModal visible={modal} title={creationTitle(nodeDataToCreate.type)} onCancel={closeModal} footer={null}>
          {form}
        </NmpModal>
      )}
    </div>
  );
};

TreeHierarchy.defaultProps = {
  expandedIds: [],
  selectedIds: [],

  onSelect: _.noop,
  onElementCreationSubmit: _.noop,

  components: defaultComponents,
};

TreeHierarchy.propTypes = {
  hierarchy: PropTypes.object.isRequired,

  expandedIds: PropTypes.arrayOf(PropTypes.string),
  onExpand: PropTypes.func,
  onCollapse: PropTypes.func,

  onSelect: PropTypes.func,
  selectedIds: PropTypes.arrayOf(PropTypes.string),

  onElementCreationSubmit: PropTypes.func,
  onFieldCreatingSubmit: PropTypes.func,
  elementCreationLoading: PropTypes.bool.isRequired,

  components: PropTypes.object,
  CreateApplicationForm: PropTypes.node,
  onFieldCreatorClickProp: PropTypes.func,
};

export default TreeHierarchy;
