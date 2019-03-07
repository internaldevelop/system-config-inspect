export function CompareStringNoCase(a, b) {
  var stringA = a.toUpperCase(); // ignore upper and lowercase
  var stringB = b.toUpperCase(); // ignore upper and lowercase

  return CompareString(stringA, stringB);
}

export function CompareString(a, b) {
  if (a < b) {
    return -1;
  } else if (a > b) {
    return 1;
  }
  // names must be equal
  return 0;
}

export function IsEmptyString(obj) {
  if (typeof obj === "undefined" || obj === null || obj === "") {
    return true;
  } else {
    return false;
  }
}
