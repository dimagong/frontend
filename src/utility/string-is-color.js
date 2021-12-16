// possible lengths
// #fff - 4
// #ffffff - 7
// #ffffff4d - 9
const possibleLengths = [4, 7, 9];

// Don't trust it, due it's a duck typing check.
export const stringIsHashColor = (string) => {
  string = String(string);
  return string[0] === "#" && possibleLengths.some((possibleLength) => string.length === possibleLength);
};

// Can be also "currentColor" or "transparent"
const POSSIBLE_VALUES = ["currentColor", "transparent"];

// Don't trust it, due it's a duck typing check.
export const stringIsColor = (string) => {
  string = String(string);
  return stringIsHashColor(string) || POSSIBLE_VALUES.includes(string);
};
