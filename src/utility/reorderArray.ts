export const reorderArray = <T>(array: Array<T>, startIndex: number, endIndex: number): Array<T> => {
  const item = array.splice(startIndex, 1)[0];
  array.splice(endIndex, 0, item);

  return array;
};
