import React from 'react'
import { Tooltip, Tag } from 'antd';
import { taskStatus } from '../../global/enumeration/TaskStatus';

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
        { tags instanceof Array && tags.length > 0 && tags.map(tag => {
          let color;
          let cellText;
          if (tag === taskStatus.TASK_FINISHED) { 
            color = 'green'; cellText = '已完成'; 
          } else if (tag === taskStatus.TASK_RUNNING) { 
            color = 'geekblue'; cellText = '运行中'; 
          } else if (tag === taskStatus.TASK_ACTIVE) { 
            color = 'geekblue'; cellText = '有效'; 
          } else if (tag === taskStatus.TASK_INACTIVE) { 
            color = 'volcano'; cellText = '无效'; 
          } else {
            color = 'volcano'; cellText = '未知'; 
          }
          return <Tag color={color} key={tag}>{cellText}</Tag>
        })}
      </span>)
  },
  {
    title: '主机名称', width: 120, dataIndex: 'host_name', key: 'host_name',
    sorter: (a, b) => a.host_name.localeCompare(b.host_name, "zh"),
  },
  // 由于 antd 表格的缺陷，IP 这列加上后，影响列border的对齐，具体原因未知
  // 因此暂时拿掉 IP 和 port 这两列
  // {
  //   title: 'IP', width: 200, dataIndex: 'host_ip', key: 'host_ip',
  //   sorter: (a, b) => a.host_ip.localeCompare(b.host_ip, "zh"),
  // },
  // {
  //   title: '端口', width: 100, dataIndex: 'host_port', key: 'host_port',
  //   sorter: (a, b) => a.host_port.localeCompare(b.host_port, "zh"),
  // },
  {
    title: '系统类型', width: 200, dataIndex: 'os_type', key: 'os_type',
    sorter: (a, b) => a.os_type.localeCompare(b.os_type, "zh"),
  },
  {
    title: '系统版本', width: 120, dataIndex: 'os_ver', key: 'os_ver',
    sorter: (a, b) => a.os_ver.localeCompare(b.os_ver, "zh"),
  },
  {
    title: '修改时间', width: 200, dataIndex: 'change_time', key: 'change_time',
    sorter: (a, b) => a.change_time.localeCompare(b.change_time, "zh"),
  },
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
