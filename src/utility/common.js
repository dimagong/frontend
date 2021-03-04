export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function capitalizeAll(string) {
  return string?.split(" ").map((word) => capitalizeFirstLetter(word)).join(" ")
}
