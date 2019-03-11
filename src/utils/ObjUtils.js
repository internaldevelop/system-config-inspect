
export function IsEmptyObject(obj) {
  if (typeof obj === "undefined" || obj === null) {
    return true;
  } else {
    return false;
  }
}

export function CopyProps(dest, src) {
  if (IsEmptyObject(src) || IsEmptyObject(dest))
    return;

  for (var prop in src) {
    if (dest.hasOwnProperty(prop)) {
      dest[prop] = src[prop];
    }
  }
}
