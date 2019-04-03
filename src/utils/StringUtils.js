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

function getTranslateList() {
  return [
    {
      eng: 'Network Error',
      chn: '网络连接错误',
    },
    {
      eng: 'Internal Error',
      chn: '系统内部错误',
    },
    {
      eng: 'Database Error',
      chn: '数据库错误',
    },
  ];
}

export function eng2chn(eng) {
  const transList = getTranslateList();
  for (let i=0; i<transList.length; i++) {
    if (transList[i].eng === eng)
      return transList[i].chn;
  }
}
