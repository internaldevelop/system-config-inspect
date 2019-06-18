/**
 * 生成指定区间的随机整数
 * @param min
 * @param max
 * @returns {number}
 */
export function randomNum(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

/**
 * 生成 uuid，形如："db3f58ff-9c3d-4a85-b9d7-8fe6d7a1ec0e
 */
export function generateUuidStr() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

export function GetTableColumnFilters(dataList, key) {
    let values = [];
    for (let item of dataList) {
        if ((item[key].length > 0) && (values.indexOf(item[key]) < 0)) {
            values.push(item[key]);
        }
    }
    return values.map(item => { return { text: item, value: item }; });
}
