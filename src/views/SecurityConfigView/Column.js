import React from 'react'
import EllipsisText from '../../components/widgets/EllipsisText';

export const columns = [
  {
    title: '序号', width: 100, dataIndex: 'index', key: 'key',
    sorter: (a, b) => a.index - b.index,
    render: content => <div>{content}</div>,
  },
  {
    title: '名称', width: 200, dataIndex: 'name', 
    sorter: (a, b) => a.name.localeCompare(b.name, "zh"),
    render: content => <EllipsisText content={content} width={200}/>,
  },
  {
    title: '策略分组', width: 200, dataIndex: 'group_name', 
    sorter: (a, b) => a.group_name.localeCompare(b.group_name, "zh"),
    render: content => <EllipsisText content={content} width={200}/>,
  },
  {
    title: '主机名称', width: 200, dataIndex: 'asset_name', 
    sorter: (a, b) => a.asset_name.localeCompare(b.asset_name, "zh"),
    render: content => <EllipsisText content={content} width={200}/>,
  },
  {
    title: '等保1级', width: 200, dataIndex: 'lv1_require', 
    render: content => <EllipsisText content={content} width={200}/>,
  },
  {
    title: '等保2级', width: 200, dataIndex: 'lv2_require', 
    render: content => <EllipsisText content={content} width={200}/>,
  },
  {
    title: '等保3级', width: 200, dataIndex: 'lv3_require', 
    render: content => <EllipsisText content={content} width={200}/>,
  },
  {
    title: '等保4级', width: 200, dataIndex: 'lv4_require', 
    render: content => <EllipsisText content={content} width={200}/>,
  },
  {
    title: '',
    fixed: 'right',
    width: 150,
    render: () => (
      <span>
      </span>
    ),
  },
];
