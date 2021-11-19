import { useEffect, useRef } from "react";

export const useEventListener = (
  elementRef,
  listener,
  eventType,
  options = false
) => {
  const savedListenerRef = useRef(listener);

  useEffect(() => void (savedListenerRef.current = listener), [listener]);

  useEffect(() => {
    const savedListener = (event) => savedListenerRef.current(event);

    document.addEventListener(eventType, savedListener, options);

    return () =>
      document.removeEventListener(eventType, savedListener, options);
  }, [eventType, options]);
};
