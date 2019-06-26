import React from 'react'
import CustomMenu from "../components/menu/CustomMenu";

// getNaviNames() {
//     return ['任务管理', '安全配置管理', '检测结果', '风险预警', '账号信息', '注册管理', '退出账号'];
//   }

const menus = [
    {
        title: '项目管理',
        icon: 'home',
        key: '/home',
    },
    {
        title: '任务管理',
        icon: 'project',
        key: '/home/task-manage'
    },
    {
        title: '安全配置管理',
        icon: 'laptop',
        key: '/home/sec-config',
        subs: [
            { key: '/home/sec-config/knowledge', title: '安全策略知识库', icon: 'database', },
            { key: '/home/sec-config/management', title: '安全策略管理', icon: 'security-scan', },
        ]
    },
    {
        title: '检测结果',
        icon: 'dashboard',
        key: '/home/inspect-result',
        subs: [
            { key: '/home/inspect-result/overview', title: '检测一览', icon: 'area-chart', },
            { key: '/home/inspect-result/details', title: '详情', icon: 'table', },
            { key: '/home/sec-config/statistics', title: '任务分析', icon: 'table', },
        ]
    },
    {
        title: '日志管理',
        icon: 'read',
        key: '/home/log-manage',
        subs: [
            { key: '/home/log-manage/inspect-logs', title: '扫描日志', icon: 'table', },
            { key: '/home/log-manage/operate-logs', title: '操作日志', icon: 'thunderbolt', },
            { key: '/home/log-manage/exception-logs', title: '异常日志', icon: 'alert', },
            { key: '/home/log-manage/system-logs', title: '系统日志', icon: 'alert', },
        ]
    },
    {
        title: '系统管理',
        icon: 'setting',
        key: '/home/sysadmin',
        subs: [
            { key: '/home/sysadmin/users', title: '用户管理', icon: 'contacts', },
            { key: '/home/sysadmin/personal', title: '个人资料', icon: 'user', },
        ]
    },
    // {
    //     title: '风险预警',
    //     icon: 'home',
    //     key: '/home'
    // },
    // {
    //     title: '首页',
    //     icon: 'home',
    //     key: '/home'
    // },
    // {
    //     title: '其它',
    //     icon: 'bulb',
    //     key: '/home/other',
    //     subs: [
    //         { key: '/home/other/test1', title: '测试（保留）-1', icon: '' },
    //         { key: '/home/other/ref1', title: '参考页面1', icon: '', },
    //         { key: '/home/other/ref2', title: '参考页面2', icon: '', },
    //         { key: '/home/other/ref3', title: '参考页面3', icon: '' },
    //         { key: '/home/other/oldtask', title: '旧任务页面', icon: '' },
    //     ]
    // },
    {
        title: '关于',
        icon: 'info-circle-o',
        key: '/home/about'
    }
]


class Navigator extends React.Component {
    render() {

        return (
            <div style={{ height: '100vh', overflowY: 'scroll' }}>
                <div style={styles.logo}></div>
                <CustomMenu menus={menus} />
            </div>
        )
    }
}

const styles = {
    logo: {
        height: '32px',
        background: 'rgba(255, 255, 255, .2)',
        margin: '16px'
    }
}

export default Navigator