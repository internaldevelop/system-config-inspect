import React from 'react'

export const columns = [
  {
    title: '序号', width: '5%', dataIndex: 'index', key: 'index',
    sorter: (a, b) => a.index - b.index,
  },
  {
    title: '任务名称', width: '30%', dataIndex: 'task_name', key: 'task_name',
    sorter: (a, b) => a.task_name.localeCompare(b.task_name,"zh"),
  },
  {
    title: '运行状态', width: '10%', dataIndex: 'run_status', key: 'run_status',
    sorter: (a, b) => a.run_status.localeCompare(b.run_status,"zh"),
  },
  {
    title: '修改时间', width: '10%', dataIndex: 'change_time', key: 'change_time',
    sorter: (a, b) => a.change_time.localeCompare(b.change_time,"zh"),
  },
  {
    title: '操作',
    key: 'operation',
    width: '15%',
    render: () => (
      <span>
        <a href="javascript:;">Action</a>
        {/* <Divider type="vertical" /> */}
      </span>
    ),
  },
];
