import React from 'react'
import { Tooltip, Tag, Input, Form } from 'antd';
const { TextArea } = Input;

export const columns = [
  {
    title: '序号', width: 100, dataIndex: 'index', key: 'index',
    sorter: (a, b) => a.index - b.index,
  },
  {
    title: '任务名称', width: 320, dataIndex: 'task_name', key: 'task_name',
    sorter: (a, b) => a.task_name.localeCompare(b.task_name, "zh"),
    render: name => (
      <Tooltip placement="topLeft" title={name}>
      <div>{name}</div>
      {/* <Form.Item label={name} /> */}
      {/* <TextArea autosize={{ maxRows: 1 }} defaultValue={name} disabled='true' /> */}
      </Tooltip>
    )
  },
  {
    title: '运行状态', width: 120, dataIndex: 'run_status', key: 'run_status',
    render: tags => (
      <span>
        {tags.map(tag => {
          let color;
          if (tag === '已完成') color = 'green';
          else if (tag === '运行中') color = 'geekblue';
          else color = 'volcano';
          return <Tag color={color} key={tag}>{tag}</Tag>
        })}
      </span>)
  },
  {
    title: '主机名称', width: 120, dataIndex: 'host_name', key: 'host_name',
    sorter: (a, b) => a.change_time.localeCompare(b.change_time, "zh"),
  },
  {
    title: 'IP', width: 100, dataIndex: 'host_ip', key: 'host_ip',
    sorter: (a, b) => a.change_time.localeCompare(b.change_time, "zh"),
  },
  {
    title: '端口', width: 100, dataIndex: 'host_port', key: 'host_port',
    sorter: (a, b) => a.change_time.localeCompare(b.change_time, "zh"),
  },
  {
    title: '系统类型', width: 200, dataIndex: 'os_type', key: 'os_type',
    sorter: (a, b) => a.change_time.localeCompare(b.change_time, "zh"),
  },
  {
    title: '系统版本', width: 120, dataIndex: 'os_ver', key: 'os_ver',
    sorter: (a, b) => a.change_time.localeCompare(b.change_time, "zh"),
  },
  // {
  //   title: '操作',
  //   key: 'operation',
  //   width: 250,
  //   render: () => (
  //     <span>
  //       <a href="javascript:;">Action</a>
  //       {/* <Divider type="vertical" /> */}
  //     </span>
  //   ),
  // },
  {
    title: '修改时间', width: 200, dataIndex: 'change_time', key: 'change_time',
    sorter: (a, b) => a.change_time.localeCompare(b.change_time, "zh"),
  },
  {
    title: '操作',
    key: 'operation',
    width: 250,
    fixed: 'right',
    render: () => (
      <span>
        <a href="javascript:;">Action</a>
        {/* <Divider type="vertical" /> */}
      </span>
    ),
  },
];
