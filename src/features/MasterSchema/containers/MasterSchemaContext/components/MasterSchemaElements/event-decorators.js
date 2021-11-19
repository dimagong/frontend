export const preventDefault = (callback) => (event) => {
  callback(event);
  event.preventDefault();
};

export const stopPropagation = (callback) => (event) => {
  callback(event);
  event.stopPropagation();
};
