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
      eng: 'OK',
      chn: '成功',
    },
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

/**
 * 对指定的英文字符串查表，返回对应的中文字符串
 * @param {String} eng 待转换的英文字符串
 * @return {String} 中文字符串
 */
export function eng2chn(eng) {
  // 获取翻译列表
  const transList = getTranslateList();

  for (let i=0; i<transList.length; i++) {
    // 如果有匹配的，则返回对应的中文字符串
    if (transList[i].eng === eng)
      return transList[i].chn;
  }

  // 没有匹配时，则返回原英文字符串
  return eng;
}

export function getGroupAlias(name) {
  // return name;
  switch (name) {
      case "startup":
          return "开机安全配置";
      case "accounts":
          return "账户安全配置";
      case "passowrd":
          return "密码配置";
      case "services":
          return "服务安全配置";
      case "login":
          return "登陆安全配置";
      case "syslog":
          return "日志安全配置";
      case "iptables":
          return "iptables配置";
      default:
          return "未知";
  }
}

