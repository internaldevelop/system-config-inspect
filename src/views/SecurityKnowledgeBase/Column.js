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
    title: '危险等级', width: 300, dataIndex: 'risk_level', key: 'risk_level',
    sorter: (a, b) => a.risk_level.localeCompare(b.risk_level, "zh")
  },
  {
    title: '安保1级', width: 300, dataIndex: 'lv1_require', key: 'lv1_require',
    sorter: (a, b) => a.lv1_require.localeCompare(b.lv1_require, "zh")
  },
  {
    title: '安保2级', width: 300, dataIndex: 'lv2_require', key: 'lv2_require',
    sorter: (a, b) => a.lv2_require.localeCompare(b.lv2_require, "zh")
  },
  {
    title: '安保3级', width: 300, dataIndex: 'lv3_require', key: 'lv3_require',
    sorter: (a, b) => a.lv3_require.localeCompare(b.lv3_require, "zh")
  },
  {
    title: '安保4级', width: 300, dataIndex: 'lv4_require', key: 'lv4_require',
    sorter: (a, b) => a.lv4_require.localeCompare(b.lv4_require, "zh")
  },
  {
    title: '解决方案', width: '300px', dataIndex: 'solutions', key: 'solutions',
    render: solution => (
      <Tooltip placement="topLeft" title={solution}>
        <div>{solution}</div>
      </Tooltip>
    )
  },
  {
    title: '操作系统', width: 160, dataIndex: 'os_type', key: 'os_type',
    sorter: (a, b) => a.os_type.localeCompare(b.os_type, "zh"),
  },
];
