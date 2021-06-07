export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function capitalizeAll(string) {
  return string?.split(" ").map((word) => capitalizeFirstLetter(word)).join(" ")
}

export function getIndexById(arr, id) {
  return arr.findIndex((element) => element.id === id);
}

export function getUserById(arr, id) {
  return arr[getIndexById(arr, id)];
}

export function getUserAndUserIndex(arr, id) {
  return {
    userIndex: getIndexById(arr, id),
    user: getUserById(arr, id),
  }
}

export function mergeObjects(obj1, obj2) {
  if (typeof obj2 !== 'object') {
    return obj1 + obj2
  }
  Object.keys(obj2).forEach(item => {
    if (obj1.hasOwnProperty(item)) {
      obj1[item] = mergeObjects(obj1[item], obj2[item])
    } else {
      obj1[item] = obj2[item]
    }
  });
  return obj1;
}
