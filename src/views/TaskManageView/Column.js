import React from 'react'
import { Tag, Typography } from 'antd';
import { taskStatus } from '../../global/enumeration/TaskStatus';
import EllipsisText from '../../components/widgets/EllipsisText';

export const columns = [
  {
    // fixed: 'left',
    title: '序号', width: 100, dataIndex: 'index', key: 'key',
    sorter: (a, b) => a.index - b.index,
    render: content => <div>{content}</div>,
  },
  {
    // fixed: 'left',
    title: '任务名称', width: 220, dataIndex: 'name', 
    sorter: (a, b) => a.name.localeCompare(b.name, "zh"),
    render: content => <EllipsisText content={content} width={220}/>,
  },
  {
    title: '运行状态', width: 120, dataIndex: 'status', 
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
      // return <Button style={{color: color}}>{cellText}</Button>
      // return <div>{cellText}</div>
      return <Tag color={color} key={status}>{cellText}</Tag>
    },
  },
  {
    title: '主机名称', width: 120, dataIndex: 'asset_name', 
    sorter: (a, b) => a.asset_name.localeCompare(b.asset_name, "zh"),
    render: content => <EllipsisText content={content} width={120}/>,
  },
  {
    title: 'IP', width: 200, dataIndex: 'asset_ip', 
    render: content => <EllipsisText content={content} width={180}/>,
  },
  {
    title: '端口', width: 100, dataIndex: 'asset_port', 
    // sorter: (a, b) => a.asset_port.localeCompare(b.asset_port, "zh"),
  },
  {
    title: '系统类型', width: 150, dataIndex: 'asset_os_type', 
    sorter: (a, b) => a.asset_os_type.localeCompare(b.asset_os_type, "zh"),
    render: content => <EllipsisText content={content} width={150}/>,
  },
  {
    title: '系统版本', width: 120, dataIndex: 'asset_os_ver', 
    sorter: (a, b) => a.asset_os_ver.localeCompare(b.asset_os_ver, "zh"),
    render: content => <EllipsisText content={content} width={120}/>,
  },
  {
    title: '创建时间', width: 160, dataIndex: 'create_time', 
    sorter: (a, b) => a.create_time.localeCompare(b.create_time, "zh"),
    render: content => <EllipsisText content={content} width={160}/>,
  },
  {
    title: '定时启动', width: 120, dataIndex: 'run_timer_cfg', 
  },
  {
    title: '',
    width: 250,
    fixed: 'right',
    render: () => (
      <span>
      </span>
    ),
  },
];
