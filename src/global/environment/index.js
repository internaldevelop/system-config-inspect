

// 1: 主站系统自动化配置核查工具
// 2: 终端系统自动化配置检测工具
// 3: 主站性能测试工具
const SYSTEM_TYPE = 3;

const PROTOCOL = 'http';
//const BASE_URL = '://192.168.1.80:8090/'; // TQ 80虚拟机
//const BASE_URL = '://192.168.1.70:8090/'; // TQ 虚拟机
//const BASE_URL = '://192.168.1.60:8090/'; // TQ 本机
// const BASE_URL = '://192.168.207.138:8090/'; // WYT 虚拟机
const BASE_URL = '://localhost:8090/'; // 本地
// const BASE_URL = '://172.16.60.5:8090/'; // 信通所云服务器

export function GetSystemType() {
    return SYSTEM_TYPE;
}

export function GetSystemName() {
    if (SYSTEM_TYPE === 1) {
        return "主站系统自动化配置核查工具";
    } else if (SYSTEM_TYPE === 2) {
        return "终端系统自动化配置检测工具";
    } else if (SYSTEM_TYPE === 3) {
        return "主站性能测试工具";
    } else {
        return "主站 & 终端系统自动化配置核查工具";
    }
}

export function GetBackEndRootUrl() {
    return PROTOCOL + BASE_URL + 'api';
}

export function GetWebSocketUrl() {
    return 'ws' + BASE_URL + 'websocket/';
}

export function IsSimulateMode() {
    // return true;
    return false;
}

export function GetViewMinWidth() {
    return 1100;
}
