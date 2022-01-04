import _ from "lodash/fp";
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { buildHierarchy } from "./hierarchy-mock-utils";
import { useMasterSchemaExpandable } from "./useMasterSchemaExpandable";

describe("useMasterSchemaSelectable", () => {
  let container = null;
  let expandableState = null;
  let expandableMethods = null;

  const testHierarchy = buildHierarchy();

  const TestComponent = ({ hierarchy }) => {
    const [state, methods] = useMasterSchemaExpandable(hierarchy);

    expandableState = state;
    expandableMethods = methods;

    return state.expandedIds.join();
  };

  const renderTestComponent = (hierarchy) => render(<TestComponent hierarchy={hierarchy} />, container);

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
  });

  afterEach(() => {
    expandableState = null;
    expandableMethods = null;
  });

  it("nullable hierarchy", () => {
    renderTestComponent();

    const root = testHierarchy.nodeMap.get("root");

    expect(expandableState.expandedIds).toStrictEqual([]);
    expect(() => expandableMethods.collapse(root)).toThrow();
  });

  describe("isDecedentsExpanded", () => {
    it("initialy only root expanded", () => {
      renderTestComponent(testHierarchy);

      expect(expandableState.isDecedentsExpanded).toBe(false);
      expect(expandableState.expandedIds).toStrictEqual(["root"]);
    });

    it("root is collapsed", () => {
      renderTestComponent(testHierarchy);

      expandableMethods.setKeys([]);
      expect(expandableState.isDecedentsExpanded).toBe(false);
    });

    it("some root's decedent is expanded", () => {
      renderTestComponent(testHierarchy);

      expandableMethods.setKeys(_.concat(["group1"]));
      expect(expandableState.isDecedentsExpanded).toBe(true);
    });
  });

  it("expandOnlyRoot", () => {
    renderTestComponent(testHierarchy);

    expandableMethods.setKeys(_.concat(["group1", "group2", "group3"]));

    expect(expandableState.expandedIds).toStrictEqual(["group1", "group2", "group3", "root"]);
    expandableMethods.expandOnlyRoot();
    expect(expandableState.expandedIds).toStrictEqual(["root"]);
  });

  it("expand", () => {
    renderTestComponent(testHierarchy);

    const root = testHierarchy.nodeMap.get("root");
    const group = testHierarchy.nodeMap.get("group1");

    expandableMethods.expand(root);
    expect(expandableState.expandedIds).toStrictEqual(["root"]);

    expandableMethods.expand(group);
    expect(expandableState.expandedIds).toStrictEqual(["root", "group1"]);
  });

  it("collapse", () => {
    renderTestComponent(testHierarchy);

    const root = testHierarchy.nodeMap.get("root");

    expandableMethods.setKeys(_.concat(["group2", "group3"]));
    expect(expandableState.expandedIds).toStrictEqual(["group2", "group3", "root"]);

    expandableMethods.collapse(root);
    expect(expandableState.expandedIds).toStrictEqual([]);
  });

  it("expandAll", () => {
    renderTestComponent(testHierarchy);

    expandableMethods.expandAll();
    expect(expandableState.expandedIds).toStrictEqual([...testHierarchy.nodeMap.keys()]);
  });
});
