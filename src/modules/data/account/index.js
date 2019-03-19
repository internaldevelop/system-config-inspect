
let accountCount = 0;
let accounts = [];

export function FetchAllAcounts() {
    // 清空保存账号信息的数组
    accounts.splice(0, accounts.length);

    // 获取账号数据
    accountCount = 20;
    for (let i = 0; i < accountCount; i++) {
        accounts.push({
            index: i,
            account: `账号-${i+1}`,
            name: `用户 ${i+1}`,
            address: '',
            email: '',
            phone: '13900013254',
            desc: '',
            status: (i % 2 === 1) ? 0 : 1
        })
    }
    return accounts;
}

export function GetAccountByIndex(index) {
    if (index >= accounts.length)
        return null;
    return accounts[index];
}