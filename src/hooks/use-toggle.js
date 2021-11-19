import { useState } from 'react';

export function useToggle(initialState) {
  const [state, set] = useState(initialState);
  const toggle = () => set((prevState) => !prevState);

  return [state, toggle, set];
}
