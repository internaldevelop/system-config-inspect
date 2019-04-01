import React from 'react'
import { Tooltip } from 'antd';

export const columns = [
  {
    title: '序号', width: 100, dataIndex: 'index', key: 'index',
    sorter: (a, b) => a.index - b.index,
  },
  {
    title: '名称', width: 240, dataIndex: 'name', key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name, "zh"),
    render: name => (
      <Tooltip placement="topLeft" title={name}>
        <div>{name}</div>
      </Tooltip>
    )
  },
  {
    title: '分组', width: 160, dataIndex: 'group', key: 'group',
    sorter: (a, b) => a.group.localeCompare(b.group, "zh"),
  },
  {
    title: '类型', width: 160, dataIndex: 'policy_type', key: 'policy_type',
    sorter: (a, b) => a.policy_type.localeCompare(b.policy_type, "zh"),
  },
  {
    title: '危险等级', width: 200, dataIndex: 'risk_level', key: 'risk_level',
    sorter: (a, b) => a.risk_level.localeCompare(b.risk_level, "zh")
  },
  {
    title: '解决方案', width: '300px', dataIndex: 'solution', key: 'solution',
    render: solution => (
      <Tooltip placement="topLeft" title={solution}>
        <div>{solution}</div>
      </Tooltip>
    )

  },
  {
    title: '修改时间', width: 200, dataIndex: 'change_time', key: 'change_time',
    sorter: (a, b) => a.change_time.localeCompare(b.change_time, "zh"),
  },
];
