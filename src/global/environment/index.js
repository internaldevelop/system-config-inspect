

// 1: 主站系统自动化配置核查工具
// 2: 终端系统自动化配置检测工具
// 3: 主站性能测试工具
// 4: 终端漏洞利用工具
const SYSTEM_TYPE = 4;


var PROTOCOL = 'https';
// 主服务端口：ng映射端口 12001
const MAIN_S_PORT = '12001';
// Agent服务端口：ng映射端口 12002
const AGENT_S_PORT = '12002';
// 漏洞库服务端口：ng映射端口 12003
const EDB_PORT = '12003'

// var PROTOCOL = 'http';
// // 主服务端口：原始端口 8090
// const MAIN_S_PORT = '8090';
// // Agent服务端口：原始端口 8191
// const AGENT_S_PORT = '8191';
// // 漏洞库服务端口：原始端口 10091
// const EDB_PORT = '10091'

// 本地： localhost
// WYT 虚拟机： 192.168.182.88
// TQ 直连虚拟机： 192.168.1.70
// TQ 本机： 192.168.1.60
// TQ wifi虚拟机： 172.16.113.67
// 信通所云服务器： 172.16.60.5
const BASE_URL = '://ytwei.club:' + MAIN_S_PORT + '/';

export const BASE_URL2 = '://ytwei.club:' + EDB_PORT;

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
    } else if (SYSTEM_TYPE === 4) {
        return "终端漏洞利用工具";
    } else {
        return "主站 & 终端系统自动化配置核查工具";
    }
}

export function GetBackEndRootUrl() {
    return PROTOCOL + BASE_URL + 'api';
}

export function GetBackEndRootUrl2(baseUrl) {
    return PROTOCOL + baseUrl;
}

export function GetAgentRootUrl(agentIp) {
    return PROTOCOL + '://' + agentIp + ':' + AGENT_S_PORT;
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
