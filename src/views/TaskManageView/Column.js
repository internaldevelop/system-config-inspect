import React from 'react'

export const columns = [
    {
      title: '#', width: '8%', dataIndex: 'index', key: 'index', 
    },
    {
      title: '任务名称', width: '30%', dataIndex: 'task_name', key: 'task_name',
    },
    { title: '运行状态', width: '18%', dataIndex: 'run_status', key: 'run_status' },
    { title: '修改时间', width: '18%', dataIndex: 'change_time', key: 'change_time' },
    {
      title: 'Action',
      key: 'operation',
      width: '18%',
      render: () => (
        <span>
          <a href="javascript:;">Action</a>
          {/* <Divider type="vertical" /> */}
        </span>
      ),
    },
  ];
