import { useCallback, useState } from "react";

export const useExpandable = (initialExpandedIds = []) => {
  const [expandedIds, setExpandedIds] = useState(initialExpandedIds);

  const expand = useCallback((id) => setExpandedIds((prev) => [...new Set([...prev, id])]), []);

  const collapse = useCallback((id) => setExpandedIds((prev) => prev.filter((existId) => existId !== id)), []);

  return [{ expandedIds }, { expand, collapse, setExpandedIds }];
};
