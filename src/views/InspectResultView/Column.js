import React from 'react'
import EllipsisText from '../../components/widgets/EllipsisText';

export const columns = [
    {
        title: '序号', width: 80, dataIndex: 'index', key: 'index',
        sorter: (a, b) => a.index - b.index,
    },
    {
        title: '检测任务名称', width: 150, dataIndex: 'task_name', key: 'task_name',
        sorter: (a, b) => a.task_name.localeCompare(b.task_name, "zh"),
        render: content => <EllipsisText content={content} width={150}/>,
    },
    {
        title: '任务号', width: 80, dataIndex: 'task_id', key: 'task_id',
        sorter: (a, b) => a.task_id.localeCompare(b.task_id, "zh"),
        render: content => <EllipsisText content={content} width={80}/>,
    },
    {
        title: '检测目标', width: 100, dataIndex: 'target_name', key: 'target_name',
        sorter: (a, b) => a.target_name.localeCompare(b.target_name, "zh"),
        render: content => <EllipsisText content={content} width={100}/>,
    },
    {
        title: '目标IP', width: 120, dataIndex: 'target_ip', key: 'target_ip',
        sorter: (a, b) => a.target_ip.localeCompare(b.target_ip, "zh"),
        render: content => <EllipsisText content={content} width={120}/>,
    },
    {
        title: '问题类型', width: 150, dataIndex: 'risk_type', key: 'risk_type',
        sorter: (a, b) => a.risk_type.localeCompare(b.risk_type, "zh"),
        render: content => <EllipsisText content={content} width={150}/>,
    },
    // {
    //     title: '问题描述', width: 150, dataIndex: 'risk_desc', key: 'risk_desc',
    // },
    {
        title: '危害等级', width: 100, dataIndex: 'risk_level', key: 'risk_level',
        sorter: (a, b) => a.risk_level.localeCompare(b.risk_level, "zh"),
        render: content => <EllipsisText content={content} width={100}/>,
    },
    // {
    //     title: '建议方案', width: 150, dataIndex: 'solution', key: 'solution',
    // },
];
