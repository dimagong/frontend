import "./styles.scss";

import PropTypes from "prop-types";
import { isEmpty } from "lodash/fp";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useTreeData } from "hooks/use-tree";
import { useBoolean } from "hooks/use-boolean";
import { useToggleable } from "hooks/use-toggleable";

import TreeRoot from "components/tree/tree-root";
import SurveyModal from "features/Surveys/Components/SurveyModal";

import appSlice from "app/slices/appSlice";
import { selectLoading } from "app/selectors";
import { selectSelectedOrganization } from "app/selectors/masterSchemaSelectors";

import MSETreeElement from "./components/mse-tree-element";
import MSETreeNodeList from "./components/mse-tree-node-list";
import { ADD_FIELD, ADD_GROUP } from "./mse-addition-actions";
import MSECreateElementForm from "./components/mse-create-element-form";

const { addFieldToMasterSchemaRequest, addGroupToMasterSchemaRequest, setSelectedMasterSchemaNodes } = appSlice.actions;

// ToDo: ✔ Make more abstract and reusable component for tree
// ToDo: ✔ Make useTreeData hook
// ToDo: ✔ Use prepared UI components for Tree abstraction component - Make UI
// ToDo: ~ Make modal UI for category\element creation form
//          ✔ Use the SurveyModal as an example. - Can be used.
//          ✔ Use the MemberFirms as an example. - Can't be used due to not good example.
//          ✔ Create simple input component. (Try reuse from reactstrap/mui)
//          ✔ Create simple select component. (Try reuse from reactstrap/mui/react-select)
//          - Create simple multiple-input component.
// ToDo: - Make data for tree. Use swagger to bind UI with API.
//          ✔ Find out how to work with state
//          ✔ Look at redux store
//          ✔ Look at sagas
// ToDo: - Make selected event to handle it (when should show detailed component)
// ToDo: - Merge request MSTRee

const getKey = ({ key }) => key;

const MasterSchemaElements = ({ root }) => {
  const dispatch = useDispatch();
  const loading = useSelector(selectLoading);
  const selectedOrganization = useSelector(selectSelectedOrganization);
  const items = useMemo(() => [root], [root]);
  const tree = useTreeData({
    items,
    getKey,
    getChildren: ({ containable, fields, groups }) =>
      containable ? root.children.filter(({ key }) => [...groups, ...fields].includes(key)) : [],
  });
  // ToDo: refactor it may cause unhandled cases
  const [addTo, setAddTo] = useState(null);
  const selectable = useToggleable([]);
  const expandable = useToggleable([]);

  const [modal, openModal, closeModal] = useBoolean(false);

  const onPopupAction = ({ key, type }) => {
    switch (type) {
      case ADD_FIELD:
        openModal();
        setAddTo({ item: tree.getItem(key), type: ADD_FIELD });
        break;
      case ADD_GROUP:
        openModal();
        setAddTo({ item: tree.getItem(key), type: ADD_GROUP });
        break;
      default:
        throw new Error("Unexpected popup action type.");
    }
  };

  const onSubmitCreateElement = (submitted) => {
    if (submitted.invalid) return;
    // ToDo: consider about react-toastify here
    if (!addTo || !selectedOrganization) throw new Error("Unexpected form submitting.");

    const { name } = submitted.values;

    switch (addTo.type) {
      case ADD_FIELD:
        dispatch(
          addFieldToMasterSchemaRequest({ name, toGroup: addTo.item.value, toOrganization: selectedOrganization })
        );
        break;
      case ADD_GROUP:
        dispatch(
          addGroupToMasterSchemaRequest({ name, toParent: addTo.item.value, toOrganization: selectedOrganization })
        );
        break;
      default:
        throw new Error("Unexpected element addition type.");
    }

    closeModal();
  };

  // Tree needs to be updated only when items change. Or it'll cause a stack overflow
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => tree.update(items), [items]);

  useEffect(() => void dispatch(setSelectedMasterSchemaNodes(selectable.keys)), [dispatch, selectable.keys]);

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
