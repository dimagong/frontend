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
