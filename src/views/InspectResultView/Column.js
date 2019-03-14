export const columns = [
    {
        title: '序号', width: 100, dataIndex: 'index', key: 'index',
        sorter: (a, b) => a.index - b.index,
    },
    {
        title: '检测任务', width: 150, dataIndex: 'task_name', key: 'task_name',
        sorter: (a, b) => a.task_name.localeCompare(b.task_name, "zh"),
    },
    {
        title: '任务ID', width: 150, dataIndex: 'task_id', key: 'task_id',
        sorter: (a, b) => a.task_id.localeCompare(b.task_id, "zh"),
    },
    {
        title: '检测目标', width: 150, dataIndex: 'target_name', key: 'target_name',
        sorter: (a, b) => a.target_name.localeCompare(b.target_name, "zh"),
    },
    {
        title: '目标IP', width: 150, dataIndex: 'target_ip', key: 'target_ip',
        sorter: (a, b) => a.target_ip.localeCompare(b.target_ip, "zh"),
    },
    {
        title: '问题类型', width: 150, dataIndex: 'risk_type', key: 'risk_type',
        sorter: (a, b) => a.risk_type.localeCompare(b.risk_type, "zh"),
    },
    {
        title: '问题描述', width: 150, dataIndex: 'risk_desc', key: 'risk_desc',
    },
    {
        title: '危害等级', width: 150, dataIndex: 'risk_level', key: 'risk_level',
        sorter: (a, b) => a.risk_level.localeCompare(b.risk_level, "zh"),
    },
    {
        title: '建议方案', width: 150, dataIndex: 'solution', key: 'solution',
    },
];
