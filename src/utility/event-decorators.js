export const preventDefault = (callback) => (event) => {
  event.preventDefault();
  callback && callback(event);
};

export const stopPropagation = (callback) => (event) => {
  event.stopPropagation();
  callback && callback(event);
};

export const stopAndPrevent = (callback) => (event) => {
  event.preventDefault();
  event.stopPropagation();
  callback && callback(event);
};
