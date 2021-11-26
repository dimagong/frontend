import { useMemo, useState } from "react";

// :: <T>(node: T): string
const defaultGetKey = (node) => node.id ?? node.key;
// :: <T>(node: T): T[]
const defaultGetChildren = (node) => node.children || [];

export const useTreeData = ({ items: initialItems = [], getKey = defaultGetKey, getChildren = defaultGetChildren }) => {
  const buildTree = (initialItems, parentKey) => {
    return initialItems.map((item) => {
      const node = {
        key: getKey(item),
        parentKey: parentKey,
        value: item,
        children: null,
      };

      node.children = buildTree(getChildren(item), node.key);
      map.set(node.key, node);

      return node;
    });
  };

  const updateTree = (items, key, update) => {
    let node = map.get(key);

    if (!node) {
      return items;
    }

    let newNode = update(node);
    if (newNode == null) {
      deleteNode(node);
    } else {
      addNode(newNode);
    }

    while (node.parentKey) {
      const nextParent = map.get(node.parentKey);
      const copy = {
        key: nextParent.key,
        parentKey: nextParent.parentKey,
        value: nextParent.value,
        children: null,
      };

      let children = nextParent.children;
      if (newNode == null) {
        children = children.filter((c) => c !== node);
      }

      copy.children = children.map((child) => (child === node ? newNode : child));

      map.set(copy.key, copy);

      newNode = copy;
      node = nextParent;
    }

    if (newNode == null) {
      items = items.filter((c) => c !== node);
    }

    return items.map((item) => {
      if (item === node) {
        return newNode;
      }

      return item;
    });
  };

  const addNode = (node) => {
    map.set(node.key, node);

    for (const child of node.children) {
      addNode(child);
    }
  };

  const deleteNode = (node) => {
    map.delete(node.key);

    for (const child of node.children) {
      deleteNode(child);
    }
  };

  const insertItem = (parentKey, index, ...values) => {
    setItems(items => {
      let nodes = buildTree(values, parentKey);

      // If parentKey is null, insert into the root.
      if (parentKey == null) {
        return [
          ...items.slice(0, index),
          ...nodes,
          ...items.slice(index)
        ];
      }

      // Otherwise, update the parent node and its ancestors.
      return updateTree(items, parentKey, parentNode => ({
        key: parentNode.key,
        parentKey: parentNode.parentKey,
        value: parentNode.value,
        children: [
          ...parentNode.children.slice(0, index),
          ...nodes,
          ...parentNode.children.slice(index)
        ]
      }));
    });
  };

  const appendItem = (parentKey, ...values) => {
    if (parentKey == null) {
      insertItem(null, items.length, ...values);
    } else {
      let parentNode = map.get(parentKey);
      if (!parentNode) {
        return;
      }

      insertItem(parentKey, parentNode.children.length, ...values);
    }
  };

  const updateItem = (oldKey, newValue) => {
    setItems((items) =>
      updateTree(items, oldKey, (oldNode) => ({
        key: oldNode.key,
        parentKey: oldNode.parentKey,
        value: newValue,
        children: buildTree(getChildren(newValue), oldNode.key),
      }))
    );
  };

  const moveItem = (key, toParentKey, index) => {
    setItems(items => {
      let node = map.get(key);
      if (!node) {
        return items;
      }

      items = updateTree(items, key, () => null);

      const movedNode = {
        ...node,
        parentKey: toParentKey
      };

      return updateTree(items, toParentKey, parentNode => ({
        key: parentNode.key,
        parentKey: parentNode.parentKey,
        value: parentNode.value,
        children: [
          ...parentNode.children.slice(0, index),
          movedNode,
          ...parentNode.children.slice(index)
        ]
      }));
    });
  };

  const map = useMemo(() => new Map(), []);

  // Compute this only on initial render.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialNodes = useMemo(() => buildTree(initialItems), []);
  const [items, setItems] = useState(initialNodes);

  return {
    items,
    getItem: (key) => {
      return map.get(key);
    },
    insertItem,
    appendItem,
    moveItem,
    updateItem,
    update: (items) => setItems(buildTree(items)),
  };
};
