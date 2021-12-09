import { useEffect, useRef } from "react";

export const useEventListener = (elementRef, listener, eventType, options = false) => {
  const savedListenerRef = useRef(listener);

  useEffect(() => void (savedListenerRef.current = listener), [listener]);

  useEffect(() => {
    const { current } = elementRef;
    if (!current) return;

    const savedListener = (event) => savedListenerRef.current(event);

    elementRef.current.addEventListener(eventType, savedListener, options);

    return () => current.removeEventListener(eventType, savedListener, options);
  }, [elementRef, eventType, options]);
};
