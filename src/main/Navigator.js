import React from 'react'
import CustomMenu from "../components/menu/CustomMenu";

// getNaviNames() {
//     return ['任务管理', '安全配置管理', '检测结果', '风险预警', '账号信息', '注册管理', '退出账号'];
//   }

const menus = [
    {
        title: '任务管理',
        icon: 'home',
        key: '/home'
    },
    {
        title: '安全配置管理',
        icon: 'laptop',
        key: '/home/sec-config'
    },
    {
        title: '检测结果',
        icon: 'laptop',
        key: '/home/inspect-result',
        subs: [
            { key: '/home/inspect-result/overview', title: '检测一览', icon: '', },
            { key: '/home/inspect-result/details', title: '详情', icon: '', },
        ]
    },
    {
        title: '系统管理',
        icon: 'home',
        key: '/home/sysadmin',
        subs: [
            { key: '/home/sysadmin/users', title: '用户管理', icon: '', },
            { key: '/home/sysadmin/personal', title: '个人资料', icon: '', },
        ]
    },
    // {
    //     title: '风险预警',
    //     icon: 'home',
    //     key: '/home'
    // },
    // {
    //     title: '账号信息',
    //     icon: 'home',
    //     key: '/home'
    // },
    // {
    //     title: '退出账号',
    //     icon: 'home',
    //     key: '/home'
    // },
    // {
    //     title: '首页',
    //     icon: 'home',
    //     key: '/home'
    // },
    {
        title: '其它',
        icon: 'bulb',
        key: '/home/other',
        subs: [
            { key: '/home/other/ref1', title: '参考页面1', icon: '', },
            { key: '/home/other/ref2', title: '参考页面2', icon: '', },
            { key: '/home/other/ref3', title: '参考页面3', icon: '' },
        ]
    },
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