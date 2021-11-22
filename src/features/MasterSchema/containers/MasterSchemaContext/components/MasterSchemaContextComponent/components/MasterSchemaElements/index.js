import "./styles.scss";

import React from "react";
import PropTypes from "prop-types";
import { isEmpty } from "lodash/fp";

import { useBoolean } from "hooks/use-boolean";
import TreeRoot from "components/tree/tree-root";
import { useTreeData } from "hooks/use-tree-data";
import { useToggleable } from "hooks/use-toggleable";
import SurveyModal from "features/Surveys/Components/SurveyModal";

import MSETreeElement from "./components/mse-tree-element";
import MSETreeNodeList from "./components/mse-tree-node-list";
import MSECreateElementForm from "./components/mse-create-element-form";
import { CREATE_FIELD, CREATE_GROUP } from "./mse-category-popup-actions";

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
//          - Find out how to work with state
//          - Look at redux store
//          - Look at sagas
//          - Ask about invariant cases ?
//          - Ask about client side model (DTO) ?
//          - Ask about react-toastify Can i use it ?
//          - Bind MSETree to API
// ToDo: - Make selected event to handle it (when should show detailed component)
// ToDo: - Merge request MSTRee

/* Mock */
let elementId = 0;
const element = (name, children = []) => ({
  id: elementId++,
  name,
  type: "text",
  category: children.length > 0,
  createdAt: new Date().toString().slice(0, 15),
  children,
});
const branch = () => {
  return element("ValidPath", [
    element("WelcomeVPBrochure"),
    element("Succession", [element("Element 1"), element("Element 2")]),
    element("FCA", [element("InvestmentBusiness"), element("HomeFinance")]),
  ]);
};

// eslint-disable-next-line no-unused-vars
const DEEP_TREE_MOCK = ((deep = 100) => {
  let child = element(`element ${deep}`);

  while (deep > 0) {
    deep--;
    child = element(`element ${deep}`, [child]);
  }

  return [child];
})();
// eslint-disable-next-line no-unused-vars
const BROAD_TREE_MOCK = ((length = 100) => {
  const root = [];

  while (length > 0) {
    length--;
    root.push(branch());
  }

  return root;
})();
// eslint-disable-next-line no-unused-vars
const DESIGN_TREE_MOCK = [branch()];

const MasterSchemaElements = ({ root }) => {
  const tree = useTreeData({
    items: [root],
    getKey: ({ key }) => key,
    getChildren: ({ fields = [], groups = [] }) => [...fields, ...groups],
  });
  const selectable = useToggleable([]);
  const expandable = useToggleable([]);

  const [modal, openModal, closeModal] = useBoolean(false);

  const onPopupAction = ({ id, type }) => {
    switch (type) {
      case CREATE_FIELD:
        openModal();
        console.log("create field", id);
        break;
      case CREATE_GROUP:
        openModal();
        console.log("create group", id);
        break;
      default:
        throw new Error("Unexpected type: " + type);
    }
  };

  const onSubmitCreateElement = (submitted) => console.log("element creation submitted:", submitted);

  return (
    !isEmpty(root) && (
      <div className="ms-elements">
        <div className="ms-elements__tree">
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
        </div>

        <SurveyModal isOpen={modal} title="New Element" onClose={closeModal} actions={false}>
          <MSECreateElementForm submitting={false} onSubmit={onSubmitCreateElement} />
        </SurveyModal>
      </div>
    )
  );
};

MasterSchemaElements.propTypes = {
  root: PropTypes.object.isRequired,
};

export default MasterSchemaElements;
