import { useMemo, useState } from 'react';

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
    update: (oldKey, newValue) => {
      setItems((items) =>
        updateTree(items, oldKey, (oldNode) => ({
          key: oldNode.key,
          parentKey: oldNode.parentKey,
          value: newValue,
          children: buildTree(getChildren(newValue), oldNode.key),
        }))
      );
    },
  };
};
