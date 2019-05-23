import React from 'react'
import EllipsisText from '../../components/widgets/EllipsisText';

export const columns = [
  {
    // fixed: 'left',
    title: '序号', width: 100, dataIndex: 'index', key: 'index',
    sorter: (a, b) => a.index - b.index,
    render: content => <div>{content}</div>,
  },
  {
    // fixed: 'left',
    title: '项目名称', width: 180, dataIndex: 'name', key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name, "zh"),
    render: content => <EllipsisText content={content} width={180}/>,
  },
  // {
  //   title: '执行状态', width: 150, dataIndex: 'run_status', key: 'run_status',
  //   sorter: (a, b) => a.run_status.localeCompare(b.run_status, "zh"),
  //   render: content => <EllipsisText content={content} width={150}/>,
  // },
  {
    title: '任务数目', width: 150, dataIndex: 'task_number', key: 'task_number',
    sorter: (a, b) => a.task_number.localeCompare(b.task_number, "zh"),
    render: content => <EllipsisText content={content} width={150}/>,
  },
  {
    title: '运行模式', width: 180, dataIndex: 'run_time_mode', key: 'run_time_mode',
    render: content => <EllipsisText content={content} width={180}/>,
  },
  {
    title: '输出类型', width: 180, dataIndex: 'output_mode', key: 'output_mode',
    sorter: (a, b) => a.output_mode.localeCompare(b.output_mode, "zh"),
    render: content => <EllipsisText content={content} width={180}/>,
  },
  // {
  //   title: '输出位置', width: 200, dataIndex: 'output_path', key: 'output_path',
  //   sorter: (a, b) => a.output_path.localeCompare(b.output_path, "zh"),
  //   render: content => <EllipsisText content={content} width={200}/>,
  // },
  {
    title: '',
    key: 'operation',
    width: 250,
    fixed: 'right',
    render: () => (
      <span>
      </span>
    ),
  },
];
