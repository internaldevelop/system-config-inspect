

// 1: 主站系统自动化配置核查工具
// 2: 终端系统自动化配置检测工具
const SYSTEM_TYPE = 2;

export function GetSystemType() {
    return SYSTEM_TYPE;
}

export function GetSystemName() {
    if (SYSTEM_TYPE === 1) {
        return "主站系统自动化配置核查工具";
    } else if (SYSTEM_TYPE === 2) {
        return "终端系统自动化配置检测工具";
    } else {
        return "主站 & 终端系统自动化配置核查工具";
    }
}

export function GetBackEndRootUrl() {
    return 'http://localhost:8090/api';
}

export function GetWebSocketUrl() {
    return "ws://localhost:8090/websocket/";
}

export function IsSimulateMode() {
    // return true;
    return false;
}
