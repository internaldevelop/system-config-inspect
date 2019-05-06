import React from 'react'
import { Tooltip, Tag } from 'antd';
import { taskStatus } from '../../global/enumeration/TaskStatus';

export const columns = [
  {
    title: '序号', width: 100, dataIndex: 'index', key: 'index',
    sorter: (a, b) => a.index - b.index,
  },
  {
    title: '任务名称', width: 320, dataIndex: 'name', key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name, "zh"),
    render: name => (
      <Tooltip placement="topLeft" title={name}>
      <div>{name}</div>
      {/* <Form.Item label={name} /> */}
      {/* <TextArea autosize={{ maxRows: 1 }} defaultValue={name} disabled='true' /> */}
      </Tooltip>
    )
  },
  {
    title: '运行状态', width: 120, dataIndex: 'status', key: 'status',
    render: status => { 
      let color;
      let cellText;
      if (status === taskStatus.TASK_FINISHED) { 
        color = 'green'; cellText = '已完成'; 
      } else if (status === taskStatus.TASK_RUNNING) { 
        color = 'geekblue'; cellText = '运行中'; 
      } else if (status === taskStatus.TASK_ACTIVE) { 
        color = 'geekblue'; cellText = '有效'; 
      } else if (status === taskStatus.TASK_INACTIVE) { 
        color = 'volcano'; cellText = '无效'; 
      } else {
        color = 'volcano'; cellText = '未知'; 
      }
      return <Tag color={color} key={status}>{cellText}</Tag>
    },
  },
  {
    title: '主机名称', width: 120, dataIndex: 'asset_name', key: 'asset_name',
    sorter: (a, b) => a.asset_name.localeCompare(b.asset_name, "zh"),
  },
  // 由于 antd 表格的缺陷，IP 这列加上后，影响列border的对齐，具体原因未知
  // 因此暂时拿掉 IP 和 port 这两列
  // {
  //   title: 'IP', width: 200, dataIndex: 'asset_ip', key: 'asset_ip',
  //   sorter: (a, b) => a.asset_ip.localeCompare(b.asset_ip, "zh"),
  // },
  // {
  //   title: '端口', width: 100, dataIndex: 'asset_port', key: 'asset_port',
  //   sorter: (a, b) => a.asset_port.localeCompare(b.asset_port, "zh"),
  // },
  {
    title: '系统类型', width: 200, dataIndex: 'asset_os_type', key: 'asset_os_type',
    sorter: (a, b) => a.asset_os_type.localeCompare(b.asset_os_type, "zh"),
  },
  {
    title: '系统版本', width: 120, dataIndex: 'asset_os_ver', key: 'asset_os_ver',
    sorter: (a, b) => a.asset_os_ver.localeCompare(b.asset_os_ver, "zh"),
  },
  {
    title: '创建时间', width: 200, dataIndex: 'create_time', key: 'create_time',
    sorter: (a, b) => a.create_time.localeCompare(b.create_time, "zh"),
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
