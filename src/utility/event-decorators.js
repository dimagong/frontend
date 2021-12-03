export const preventDefault = (callback) => (event) => {
  event.preventDefault();
  callback(event);
};

export const stopPropagation = (callback) => (event) => {
  callback(event);
  event.stopPropagation();
};
