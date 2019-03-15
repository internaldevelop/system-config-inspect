const accountCount = 20;

export function AccountData() {
    const accounts = [];
    for (let i = 0; i < accountCount; i++) {
        accounts.push({
            index: i,
            account: `账号-${i+1}`,
            name: `用户 ${i+1}`,
            address: '',
            email: '',
            phone: '13900013254',
            desc: '',
        })
    }
    return accounts;
}

export function AccountListData() {
    const listData = [];
    const accounts = AccountData();
    for (let i = 0; i < accountCount; i++) {
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