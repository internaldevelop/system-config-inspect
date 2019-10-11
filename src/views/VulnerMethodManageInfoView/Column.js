import React from 'react'
import EllipsisText from '../../components/widgets/EllipsisText';

export const columns = [
  {
    title: '序号', width: 90, dataIndex: 'index', key: 'key',
    sorter: (a, b) => a.index - b.index,
    render: content => <div>{content}</div>,
  },
  {
    title: '漏洞编号', width: 120, dataIndex: 'edb_id',
    sorter: (a, b) => a.edb_id - b.edb_id,
    render: content => <EllipsisText content={content} width={120} />,
  },
  {
    title: '漏洞名称', width: 250, dataIndex: 'title',
    sorter: (a, b) => a.title.localeCompare(b.title, "zh"),
    render: content => <EllipsisText content={content} width={250} />,
  },
  {
    title: '利用方法文件名', width: 250, dataIndex: 'fileName',
    sorter: (a, b) => a.fileName.localeCompare(b.fileName, "zh"),
    render: content => <EllipsisText content={content} width={250} />,
  },
  {
    title: '利用方法文件类型', width: 250, dataIndex: 'fileType',
    sorter: (a, b) => a.fileType.localeCompare(b.fileType, "zh"),
    render: content => <EllipsisText content={content} width={250} />,
  },
  {
    title: '',
    fixed: 'right',
    width: 200,
    render: () => (
      <span>
      </span>
    ),
  },
];
