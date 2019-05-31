export const runTimeMode = {
    MODE_NOW: 1,
    MODE_30MINS_LATER: 2,
    MODE_1HOUR_LATER: 3,
    MODE_1DAY_LATER: 4,
};


export const runTimeModeNames = [{
    key: 1,
    index: runTimeMode.MODE_NOW,
    name: '立即运行',
}, {
    key: 2,
    index: runTimeMode.MODE_30MINS_LATER,
    name: '30分钟后运行',
}, {
    key: 3,
    index: runTimeMode.MODE_1HOUR_LATER,
    name: '1小时后运行',
}, {
    key: 4,
    index: runTimeMode.MODE_1DAY_LATER,
    name: '1天后运行',
}];
