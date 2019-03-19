let testOption = 1;

export function GetSystemInfo() {
    if (testOption === 1) {
        return ({
            sysName: '主站和终端配置检查系统',
            desc: "按照指定策略，对本机或指定远程系统进行系统安全配置核查。",
            sysVer: '1.0.0.1001',
            copyright: 'Copyright ©2019-2022 中国电科院',
            status: '运行中',
            overview: 'Bla Bla ... \nBla Bla ... again ',
        });
    } else {
        return ({
            sysName: '未获取到系统名称',
            sysVer: '版本未知',
            copyright: '版权信息未知',
            status: '未知',
            overview: '无法获取系统任何信息',
        });
    }
}