import "./styles.scss";

import { get } from "lodash/fp";
import PropTypes from "prop-types";
import { useDispatch, useSelector } from "react-redux";
import React, { useCallback, useEffect, useState } from "react";

import { useTreeData } from "hooks/use-tree";
import { useBoolean } from "hooks/use-boolean";
import { useToggleable } from "hooks/use-toggleable";

import TreeRoot from "components/tree/tree-root";
import SurveyModal from "features/Surveys/Components/SurveyModal";

import appSlice from "app/slices/appSlice";
import { createLoadingSelector } from "app/selectors/loadingSelector";

import MSETreeElement from "./components/mse-tree-element";
import MSETreeNodeList from "./components/mse-tree-node-list";
import { ADD_FIELD, ADD_GROUP } from "./mse-addition-actions";
import MSECreateElementForm from "./components/mse-create-element-form";

const { addFieldToMasterSchemaRequest, addGroupToMasterSchemaRequest } = appSlice.actions;

const getKey = ({ key }) => key;

const creatationTitle = (type) => {
  switch (type) {
    case ADD_FIELD:
      return "New Element";
    case ADD_GROUP:
      return "New Category";
    default:
      throw new Error("Unexpected element addition type.");
  }
};

const MasterSchemaElements = ({ selectable, hierarchy, expanded }) => {
  const dispatch = useDispatch();
  const loading = useSelector(
    createLoadingSelector([addFieldToMasterSchemaRequest.type, addGroupToMasterSchemaRequest.type], true)
  );

  const tree = useTreeData({
    items: [hierarchy],
    getKey,
    getChildren: ({ isContainable, fields, groups }) =>
      isContainable ? hierarchy.children.filter(({ key }) => [...groups, ...fields].includes(key)) : [],
  });
  const expandable = useToggleable([]);
  const [addTo, setAddTo] = useState(null);

  const [modal, openModal, closeModal] = useBoolean(false);

  const onPopupAction = ({ key, type }) => {
    switch (type) {
      case ADD_FIELD:
        openModal();
        setAddTo({ node: tree.getItem(key).value, type: ADD_FIELD });
        break;
      case ADD_GROUP:
        openModal();
        setAddTo({ node: tree.getItem(key).value, type: ADD_GROUP });
        break;
      default:
        throw new Error("Unexpected popup action type.");
    }
  };

  const onSubmitCreateElement = (submitted) => {
    if (submitted.invalid) return;

    const { id } = addTo.node;
    const { name } = submitted.values;
    const payload = { name, parentId: id };

    switch (addTo.type) {
      case ADD_FIELD:
        dispatch(addFieldToMasterSchemaRequest(payload));
        break;
      case ADD_GROUP:
        dispatch(addGroupToMasterSchemaRequest(payload));
        break;
      default:
        throw new Error("Unexpected element addition type.");
    }

    closeModal();
    setAddTo(null);
  };

  const onNodeSelect = (key) => selectable.toggle([key]);

  const foldAll = useCallback(() => expandable.clear(), [expandable]);
  const getHierarchyKeys = useCallback(() => [hierarchy, ...hierarchy.children].map(get("key")), [hierarchy]);
  const expandAll = useCallback(() => expandable.setKeys(getHierarchyKeys), [expandable, getHierarchyKeys]);

  // Effect only on expanded change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void (expanded ? expandAll : foldAll)(), [expanded]);

  // Tree needs to be updated only when items change. Or it'll cause a stack overflow
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void tree.update([hierarchy]), [hierarchy]);

  return (
    <div className="ms-elements">
      <TreeRoot
        nodes={tree.items}
        getKey={getKey}
        renderNodeList={({ root, children }) => <MSETreeNodeList root={root} children={children} />}
        renderNode={({ node, children }) => (
          <MSETreeElement
            state={{ node: node.value, selectable, expandable }}
            onPopupAction={onPopupAction}
            onSelect={onNodeSelect}
            children={children}
          />
        )}
      />

      {addTo && (
        <SurveyModal isOpen={modal} title={creatationTitle(addTo.type)} onClose={closeModal} actions={false}>
          <MSECreateElementForm
            submitting={loading}
            placeholder={addTo.node.path.join(",")}
            onSubmit={onSubmitCreateElement}
          />
        </SurveyModal>
      )}
    </div>
  );
};

MasterSchemaElements.defaultProps = {
  expanded: false,
};

MasterSchemaElements.propTypes = {
  hierarchy: PropTypes.object.isRequired,
  selectable: PropTypes.object.isRequired,
  expanded: PropTypes.bool,
};

export default MasterSchemaElements;
