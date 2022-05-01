import _ from "lodash/fp";
import React from "react";
import { render, unmountComponentAtNode } from "react-dom";

import { buildHierarchy } from "api/masterSchema/masterSchemaMockUtils";
import { useTreeHierarchyExpandable } from "./useTreeHierarchyExpandable";

const tick = () => new Promise((r) => setTimeout(r));

describe("useMasterSchemaSelectable", () => {
  let container = null;
  let expandable = null;

  const testHierarchy = buildHierarchy();

  const TestComponent = ({ hierarchy }) => {
    expandable = useTreeHierarchyExpandable(hierarchy);

    return expandable.expandedIds.join();
  };

  const renderTestComponent = async (hierarchy) => {
    render(<TestComponent hierarchy={hierarchy} />, container);
    await tick();
  };

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
    expandable = null;
  });

  it("nullable hierarchy", async () => {
    await renderTestComponent();

    const root = testHierarchy.nodes["root"];

    expect(expandable.expandedIds).toStrictEqual([]);
    expect(() => expandable.collapse(root)).toThrow();
  });

  describe("isDecedentsExpanded", () => {
    it("initially only root expanded", async () => {
      await renderTestComponent();

      expect(expandable.isDecedentsExpanded).toBe(false);
    });

    it("root is collapsed", async () => {
      await renderTestComponent(testHierarchy);

      expect(expandable.expandedIds).toStrictEqual(["root"]);
      expect(expandable.isDecedentsExpanded).toBe(false);
      expandable.setKeys([]);
      expect(expandable.isDecedentsExpanded).toBe(false);
    });

    it("some root's decedent is expanded", async () => {
      await renderTestComponent(testHierarchy);

      expect(expandable.isDecedentsExpanded).toBe(false);
      expandable.setKeys(_.concat(["group1"]));
      expect(expandable.isDecedentsExpanded).toBe(true);
    });
  });

  it("expandOnlyRoot", async () => {
    await renderTestComponent(testHierarchy);

    expandable.setKeys(_.concat(["group1", "group2", "group3"]));

    expect(expandable.expandedIds).toStrictEqual(["group1", "group2", "group3", "root"]);
    expandable.expandOnlyRoot();
    expect(expandable.expandedIds).toStrictEqual(["root"]);
  });

  it("expand", async () => {
    await renderTestComponent(testHierarchy);

    const root = testHierarchy.nodes["root"];
    const group = testHierarchy.nodes["group1"];

    expandable.expand(root);
    expect(expandable.expandedIds).toStrictEqual(["root"]);

    expandable.expand(group);
    expect(expandable.expandedIds).toStrictEqual(["root", "group1"]);
  });

  it("collapse", async () => {
    await renderTestComponent(testHierarchy);

    const root = testHierarchy.nodes["root"];

    expandable.setKeys(_.concat(["group2", "group3"]));
    expect(expandable.expandedIds).toStrictEqual(["group2", "group3", "root"]);

    expandable.collapse(root);
    expect(expandable.expandedIds).toStrictEqual([]);
  });

  it("expandAll", async () => {
    await renderTestComponent(testHierarchy);

    expandable.expandAll();
    expect(expandable.expandedIds).toStrictEqual(
      _.pipe(_.filter(_.get("isContainable")), _.map(_.get("nodeId")))(testHierarchy.nodes)
    );
  });

  describe("effects", () => {
    it("clear selected when hierarchy.masterSchemaId changed", async () => {
      await renderTestComponent(testHierarchy);

      expect(expandable.expandedIds).toStrictEqual(["root"]);

      await renderTestComponent(buildHierarchy("root1", 2));

      expect(expandable.expandedIds).toStrictEqual(["root1"]);
    });
  });
});
