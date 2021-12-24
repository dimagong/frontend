import "./styles.scss";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useTreeData } from "hooks/use-tree";
import { useBoolean } from "hooks/use-boolean";

import TreeRoot from "components/tree/tree-root";

import SurveyModal from "features/Surveys/Components/SurveyModal";
import { useMasterSchemaContext } from "features/MasterSchema/use-master-schema-context";

import appSlice from "app/slices/appSlice";
import { createLoadingSelector } from "app/selectors/loadingSelector";

import MSETreeElement from "./components/mse-tree-element";
import MSETreeNodeList from "./components/mse-tree-node-list";
import { ADD_FIELD, ADD_GROUP } from "./mse-addition-actions";
import MSECreateElementForm from "./components/mse-create-element-form";

const { addFieldToMasterSchemaRequest, addGroupToMasterSchemaRequest } = appSlice.actions;

const getKey = ({ nodeId }) => nodeId;

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

const createLoading = () =>
  createLoadingSelector([addFieldToMasterSchemaRequest.type, addGroupToMasterSchemaRequest.type], true);

const MasterSchemaElements = () => {
  const { selectable, expandable, hierarchy } = useMasterSchemaContext();

  const dispatch = useDispatch();
  const loading = useSelector(createLoading());

  const [addTo, setAddTo] = useState(null);
  const tree = useTreeData({
    items: [hierarchy],
    getKey,
    getChildren: ({ isContainable, fields, groups }) =>
      isContainable ? hierarchy.children.filter(({ nodeId }) => [...groups, ...fields].includes(nodeId)) : [],
  });

  const [modal, openModal, closeModal] = useBoolean(false);

  const onPopupAction = ({ id, type }) => {
    switch (type) {
      case ADD_FIELD:
        openModal();
        setAddTo({ node: tree.getItem(id).value, type: ADD_FIELD });
        break;
      case ADD_GROUP:
        openModal();
        setAddTo({ node: tree.getItem(id).value, type: ADD_GROUP });
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

  // Tree needs to be updated only when items change. Or it'll cause a stack overflow
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => tree.update([hierarchy]), [hierarchy]);

  return (
    <div className="ms-elements">
      <TreeRoot
        nodes={tree.items}
        renderNodeList={({ root, children }) => <MSETreeNodeList root={root} children={children} />}
        renderNode={({ node, children }) => (
          <MSETreeElement
            state={{ node: node.value, selectable, expandable }}
            onPopupAction={onPopupAction}
            children={children}
          />
        )}
      />

      {addTo && (
        <SurveyModal isOpen={modal} title={creationTitle(addTo.type)} onClose={closeModal} actions={false}>
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

export default MasterSchemaElements;
