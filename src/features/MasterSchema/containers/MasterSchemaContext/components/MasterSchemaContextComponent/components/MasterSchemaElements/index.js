import "./styles.scss";

import PropTypes from "prop-types";
import { isEmpty, xor } from "lodash/fp";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useMemo, useState } from "react";

import { useTreeData } from "hooks/use-tree";
import { useBoolean } from "hooks/use-boolean";
import { useToggleable } from "hooks/use-toggleable";

import TreeRoot from "components/tree/tree-root";
import SurveyModal from "features/Surveys/Components/SurveyModal";

import appSlice from "app/slices/appSlice";
import { selectLoading } from "app/selectors";
import { selectSelectedKeys } from "app/selectors/masterSchemaSelectors";

import MSETreeElement from "./components/mse-tree-element";
import MSETreeNodeList from "./components/mse-tree-node-list";
import { ADD_FIELD, ADD_GROUP } from "./mse-addition-actions";
import MSECreateElementForm from "./components/mse-create-element-form";

const { addFieldToMasterSchemaRequest, addGroupToMasterSchemaRequest, setSelectedMasterSchemaNodes } = appSlice.actions;

const getKey = ({ key }) => key;

const MasterSchemaElements = ({ root }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const selectedNodes = useSelector(selectSelectedKeys);
  const items = useMemo(() => [root], [root]);
  const tree = useTreeData({
    items,
    getKey,
    getChildren: ({ containable, fields, groups }) =>
      containable ? root.children.filter(({ key }) => [...groups, ...fields].includes(key)) : [],
  });
  // ToDo: refactor it may cause unhandled cases
  const [addTo, setAddTo] = useState(null);
  const selectable = useToggleable(selectedNodes);
  const expandable = useToggleable([]);

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
    // ToDo: consider about react-toast here
    if (!addTo) throw new Error("Unexpected form submitting.");

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
  };

  const onNodeSelect = (key) => {
    // ToDo: Consider how to use useToggleable in this case
    const selected = xor(selectable.keys, [key]);
    dispatch(setSelectedMasterSchemaNodes(selected));
  };

  // Tree needs to be updated only when items change. Or it'll cause a stack overflow
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => tree.update(items), [items]);

  useEffect(() => selectable.setKeys(selectedNodes), [selectable, selectedNodes]);

  return (
    !isEmpty(root) && (
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

        <SurveyModal isOpen={modal} title="New Element" onClose={closeModal} actions={false}>
          <MSECreateElementForm submitting={loading} onSubmit={onSubmitCreateElement} />
        </SurveyModal>
      </div>
    )
  );
};

MasterSchemaElements.propTypes = {
  root: PropTypes.object.isRequired,
};

export default MasterSchemaElements;
