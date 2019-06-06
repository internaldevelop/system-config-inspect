import React from 'react'
import { Tooltip } from 'antd';
import EllipsisText from '../../components/widgets/EllipsisText';

export const columns = [
  {
    title: '序号', width: 100, dataIndex: 'index', key: 'index',
    sorter: (a, b) => a.index - b.index,
  },
  {
    title: '名称', width: 200, dataIndex: 'name', key: 'name',
    sorter: (a, b) => a.name.localeCompare(b.name, "zh"),
    render: content => <EllipsisText content={content} width={200}/>,
  },
  // {
  //   title: '危险等级', width: 150, dataIndex: 'risk_level', key: 'risk_level',
  //   sorter: (a, b) => a.risk_level.localeCompare(b.risk_level, "zh")
  // },
  {
    title: '等保1级', width: 250, dataIndex: 'lv1_require', key: 'lv1_require',
    sorter: (a, b) => a.lv1_require.localeCompare(b.lv1_require, "zh"),
    render: content => <EllipsisText content={content} width={250}/>,
  },
  {
    title: '等保2级', width: 250, dataIndex: 'lv2_require', key: 'lv2_require',
    sorter: (a, b) => a.lv2_require.localeCompare(b.lv2_require, "zh"),
    render: content => <EllipsisText content={content} width={250}/>,
  },
  {
    title: '等保3级', width: 250, dataIndex: 'lv3_require', key: 'lv3_require',
    sorter: (a, b) => a.lv3_require.localeCompare(b.lv3_require, "zh"),
    render: content => <EllipsisText content={content} width={250}/>,
  },
  {
    title: '等保4级', width: 250, dataIndex: 'lv4_require', key: 'lv4_require',
    sorter: (a, b) => a.lv4_require.localeCompare(b.lv4_require, "zh"),
    render: content => <EllipsisText content={content} width={250}/>,
  },
  // {
  //   title: '解决方案', dataIndex: 'solutions', key: 'solutions',
  //   render: solution => (
  //     <Tooltip placement="topLeft" title={solution}>
  //       <div>{solution}</div>
  //     </Tooltip>
  //   )
  // },
];
