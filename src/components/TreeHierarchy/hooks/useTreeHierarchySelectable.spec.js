import React from "react";
import _ from "lodash/fp";
import { render, unmountComponentAtNode } from "react-dom";

import { buildHierarchy } from "api/masterSchema/masterSchemaMockUtils";
import { useTreeHierarchySelectable } from "./useTreeHierarchySelectable";

describe("useMasterSchemaSelectable", () => {
  let toggle = null;
  let selected = null;
  let container = null;

  const testHierarchy = buildHierarchy();

  const TestComponent = ({ hierarchy }) => {
    const selectable = useTreeHierarchySelectable(hierarchy);

    toggle = (nodeId) => selectable.toggle(nodeId);
    selected = selectable.selected;

    return null;
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
    toggle = null;
    selected = null;
  });

  it("nullable hierarchy throwing an error", () => {
    renderTestComponent();

    expect(() => toggle("field1")).toThrow();
  });

  describe("useMasterSchemaSelectable#selected", () => {
    it("select & unselect group", () => {
      renderTestComponent(testHierarchy);

      expect(selected.groups.length).toBe(0);

      toggle("group1");

      expect(selected.groups.length).toBe(1);
      expect(selected.group.nodeId).toBe("group1");

      toggle("group1");

      expect(selected.groups.length).toBe(0);
      expect(selected.group).toBeUndefined();
    });

    it("select & unselect field", () => {
      renderTestComponent(testHierarchy);

      expect(selected.fields.length).toBe(0);

      toggle("field1");

      expect(selected.fields.length).toBe(1);
      expect(selected.field.nodeId).toBe("field1");

      toggle("field1");

      expect(selected.fields.length).toBe(0);
      expect(selected.field).toBeUndefined();
    });

    it("select multiple fields", () => {
      renderTestComponent(testHierarchy);

      expect(selected.fields.length).toBe(0);

      toggle("field1");
      toggle("field2");

      expect(selected.fields.length).toBe(2);
    });

    it("select a group while some group is selected", () => {
      renderTestComponent(testHierarchy);

      expect(selected.groups.length).toBe(0);

      toggle("group1");
      toggle("group2");

      expect(selected.groups.length).toBe(1);
      expect(selected.group.nodeId).toBe("group2");
    });

    it("select a group while some field is selected", () => {
      renderTestComponent(testHierarchy);

      expect(selected.groups.length).toBe(0);

      toggle("field1");
      toggle("group2");

      expect(selected.groups.length).toBe(1);
      expect(selected.group.nodeId).toBe("group2");
    });

    it("select a field while some group is selected", () => {
      renderTestComponent(testHierarchy);

      expect(selected.groups.length).toBe(0);

      toggle("group1");
      toggle("field1");

      expect(selected.groups.length).toBe(0);
      expect(selected.field.nodeId).toBe("field1");
    });
  });

  describe("effects", () => {
    it("clear selected when hierarchy.masterSchemaId changed", async () => {
      renderTestComponent(testHierarchy);

      toggle("field1");

      expect(selected.nodes.length).toBe(1);

      renderTestComponent(_.merge(testHierarchy, { masterSchemaId: 2 }));

      await new Promise((r) => setTimeout(r));
      expect(selected.nodes.length).toBe(0);
    });
  });
});
