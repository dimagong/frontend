import { useCallback } from "react";
import { useEventListener } from "./use-event-listener";

export const useOutsideEvent = (
  elementRef,
  listener,
  eventType,
  options = false
) => {
  const outsideListener = useCallback(
    (event) =>
      elementRef.current &&
      !elementRef.current.contains(event.target) &&
      listener(event),
    [elementRef, listener]
  );

  return useEventListener(elementRef, outsideListener, eventType, options);
};

export const useOutsideFocus = (elementRef, listener, options = false) =>
  useOutsideEvent(elementRef, listener, "focusin", options);

export const useOutsideClick = (elementRef, listener, options = false) =>
  useOutsideEvent(elementRef, listener, "mousedown", options);
