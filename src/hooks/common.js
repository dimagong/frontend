import { useEffect, useRef } from 'react';

// Store the previous value of variable that was passed to that hook
export const usePrevious = (value) => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};
