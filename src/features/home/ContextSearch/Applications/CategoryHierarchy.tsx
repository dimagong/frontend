import React from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch } from "react-redux";

import { TreeHierarchy, useTreeHierarchyExpandable } from "components/TreeHierarchy";

import { AHCreateCategoryForm } from "./ApplicationsHierarchy/AHCreateCategoryForm";
import { GeneralAHTreeElement } from "./ApplicationsHierarchy/GeneralAHTreeElement";
import { CreateApplicationForm } from "./ApplicationsHierarchy/CreateApplicationForm";

import appSlice from "app/slices/appSlice";
import onboardingSlice from "app/slices/onboardingSlice";

import { CreateCategorySubmitProps, Hierarchy, Search, Node, ApplicationData } from "./models";

const { setdForm } = onboardingSlice.actions;

const { setContext } = appSlice.actions;

export const CategoryHierarchy: React.FC<Props> = ({
  hierarchy,
  search,
  onElementCreationSubmit,
  onFieldCreatingSubmit,
  isLoading,
}) => {
  const expandable = useTreeHierarchyExpandable(hierarchy);

  const dispatch = useDispatch();

  React.useEffect(() => {
    if (!hierarchy) return;
    search === "" ? expandable.expandOnlyRoot() : expandable.expandAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hierarchy]);

  const onSelect = (node: Node) => {
    if (node.isContainable) {
      expandable.expandedIds.includes(node.nodeId) ? expandable.collapse(node) : expandable.expand(node);
    } else {
      // @ts-ignore
      dispatch(setdForm(node));
      // @ts-ignore
      dispatch(setContext("dForm"));
    }
  };

  return (
    <Row className="position-relative">
      <Col className="tree-hierarchy-wrapper">
        <TreeHierarchy
          hierarchy={hierarchy}
          expandedIds={expandable.expandedIds}
          onExpand={expandable.expand}
          onCollapse={expandable.collapse}
          elementCreationLoading={isLoading}
          onSelect={onSelect}
          onElementCreationSubmit={onElementCreationSubmit}
          onFieldCreatingSubmit={onFieldCreatingSubmit}
          onFieldCreatorClickProp={(value) => {
            // @ts-ignore
            dispatch(setContext("Create dForm"));
          }}
          CreateApplicationForm={CreateApplicationForm}
          components={{ Element: GeneralAHTreeElement, CreateElementForm: AHCreateCategoryForm }}
        />
      </Col>
    </Row>
  );
};

type Props = {
  hierarchy: Hierarchy;
  search: Search;
  onElementCreationSubmit: ({ type, name, parentId }: CreateCategorySubmitProps) => void;
  isLoading: boolean;
  onFieldCreatingSubmit: (submitted: ApplicationData) => void;
};
