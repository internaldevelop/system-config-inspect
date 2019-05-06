
export function IsEmptyObject(obj) {
  if (typeof obj === "undefined" || obj === null) {
    return true;
  } else {
    return false;
  }
}

/**
 * 浅拷贝，不影响目标对象中不拷贝的属性
 * @deprecated
 * @param {Object} dest 存放待拷贝属性的目标对象
 * @param {Object} src 源对象
 */
export function CopyProps(dest, src) {
  if (IsEmptyObject(src) || IsEmptyObject(dest))
    return;

  for (var prop in src) {
    // if (dest.hasOwnProperty(prop)) 
      dest[prop] = src[prop];
  }
}

/**
 * 浅拷贝，不影响目标对象中不拷贝的属性
 * @param {Object} dest 存放待拷贝属性的目标对象
 * @param {Object} src 源对象
 */
export function ShallowCopy(dest, src) {
  Object.assign(dest, src);
}

/**
 * 深克隆，复制产生新对象
 * @param {Object} src 源对象
 * @return {Object} 拷贝产生的新对象
 */
export function DeepClone(src) {
  let dest = JSON.parse(JSON.stringify(src));
  return dest;
}

/**
 * 深拷贝，将源对象深拷贝到目标对象中，不影响目标对象中不拷贝的属性
 * @param {Object} dest 存放待拷贝属性的目标对象
 * @param {Object} src 源对象
 */
export function DeepCopy(dest, src) {
  // 对源对象克隆出一个新对象
  let clone = DeepClone(src);

  // 将克隆出的对象拷贝到目标对象中
  ShallowCopy(dest, clone);
}