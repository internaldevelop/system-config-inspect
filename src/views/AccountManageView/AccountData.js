import { FetchAllAcounts } from '../../modules/data/account'

export function AccountListData() {
    const listData = [];
    const accounts = FetchAllAcounts();
    for (let i = 0; i < accounts.length; i++) {
        listData.push({
            // href: 'http://ant.design',
            index: accounts[i].index,
            title: accounts[i].name,
            avatar: 'https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png',
            description: '在线，有效期截止至2020年12月1日',
            content: '账号：' + accounts[i].account + '地址：' + accounts[i].address + '电话：' + accounts[i].phone,
        })
    }
    return listData;
}