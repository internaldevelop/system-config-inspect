import React from 'react'
import EllipsisText from '../../components/widgets/EllipsisText';

export const columns = [
  {
    title: '序号', width: 100, dataIndex: 'index', key: 'index',
    sorter: (a, b) => a.index - b.index,
    render: content => <div>{content}</div>,
  },
  {
    title: '名称', width: 200, dataIndex: 'name', key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name, "zh"),
    render: content => <EllipsisText content={content} width={200}/>,
  },
  {
    title: '策略分组', width: 200, dataIndex: 'group_name', key: 'group_name',
    sorter: (a, b) => a.group_name.localeCompare(b.group_name, "zh"),
    render: content => <EllipsisText content={content} width={200}/>,
  },
  {
    title: '主机名称', width: 200, dataIndex: 'asset_name', key: 'asset_name',
    sorter: (a, b) => a.asset_name.localeCompare(b.asset_name, "zh"),
    render: content => <EllipsisText content={content} width={200}/>,
  },
  {
    title: '安保1级', width: 300, dataIndex: 'lv1_require', key: 'lv1_require',
    render: content => <EllipsisText content={content} width={300}/>,
  },
  {
    title: '安保2级', width: 200, dataIndex: 'lv2_require', key: 'lv2_require',
    render: content => <EllipsisText content={content} width={200}/>,
  },
  {
    title: '安保3级', width: 200, dataIndex: 'lv3_require', key: 'lv3_require',
    render: content => <EllipsisText content={content} width={200}/>,
  },
  // {
  //   title: '运行模式', width: 200, dataIndex: 'run_mode', key: 'run_mode',
  //   sorter: (a, b) => a.run_mode.localeCompare(b.run_mode, "zh"),
  // },
  {
    title: '安保4级', width: 200, dataIndex: 'lv4_require', key: 'lv4_require',
    render: content => <EllipsisText content={content} width={200}/>,
  },
  // {
  //   title: '运行模式', width: 200, dataIndex: 'run_mode', key: 'run_mode',
  //   sorter: (a, b) => a.run_mode.localeCompare(b.run_mode, "zh"),
  // },
  // {
  //   title: '运行时间', width: 150, dataIndex: 'consume_time', key: 'consume_time',
  //   sorter: (a, b) => a.consume_time.localeCompare(b.consume_time, "zh"),
  //   render: content => <EllipsisText content={content} width={120}/>,
  // },
  // {
  //   title: '运行内容', width: 200, dataIndex: 'run_contents', key: 'run_contents',
  //   render: content => <EllipsisText content={content} width={200}/>,
  // },
  // {
  //   title: '操作系统', width: 150, dataIndex: 'os_type', key: 'os_type',
  //   sorter: (a, b) => a.os_type.localeCompare(b.os_type, "zh"),
  //   render: content => <EllipsisText content={content} width={150}/>,
  // },
  {
    title: '',
    key: 'operation',
    fixed: 'right',
    width: 150,
    render: () => (
      <span>
      </span>
    ),
  },
];
