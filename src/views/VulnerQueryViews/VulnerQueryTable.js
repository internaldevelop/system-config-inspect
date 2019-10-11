import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import HttpRequest from '../../utils/HttpRequest';
import EllipsisText from '../../components/widgets/EllipsisText';

import { Table, Tabs, Modal } from 'antd'

const TabPane = Tabs.TabPane;

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginLeft: 10,
    },
});

const columns = [
    {
        title: '序号', width: 120, dataIndex: 'index', key: 'index',
        sorter: (a, b) => a.index - b.index,
        render: content => <div>{content}</div>,
    },
    {
        title: '漏洞编号', width: 150, dataIndex: 'edb_id',
        sorter: (a, b) => a.edb_id - b.edb_id,
        render: content => <EllipsisText content={content} width={150} />,
    },
    {
        title: '漏洞名称', width: 220, dataIndex: 'title',
        render: content => <EllipsisText content={content} width={220} />,
    },
    {
        title: '发布者', width: 150, dataIndex: 'author',
        sorter: (a, b) => a.author.localeCompare(b.author, "zh"),
        render: content => <EllipsisText content={content} width={150} />,
    },
    {
        title: '漏洞类型', width: 150, dataIndex: 'type',
        sorter: (a, b) => a.type.localeCompare(b.type, "zh"),
        render: content => <EllipsisText content={content} width={150} />,
    },
    {
        title: '平台', width: 150, dataIndex: 'platform',
        sorter: (a, b) => a.platform.localeCompare(b.platform, "zh"),
        render: content => <EllipsisText content={content} width={150} />,
    },
    {
        title: '发现时间', dataIndex: 'date_published',
        sorter: (a, b) => a.date_published.localeCompare(b.date_published, "zh"),
        //render: content => <EllipsisText content={content} width={80} />,
    },
];

const DEFAULT_PAGE_SIZE = 10;
class VulnerQueryTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: columns,
            resultRecordData: '',
            value: '',
            field: '',
            scrollWidth: 2000,        // 表格的 scrollWidth
            scrollHeight: 300,      // 表格的 scrollHeight
            totalResult: 0,
            currentPage: 1,     // Table中当前页码（从 1 开始）
            pageSize: DEFAULT_PAGE_SIZE,
        }
        const { field, value } = this.props;
        this.getVulnerResults(this.state.currentPage, this.state.pageSize, field, value);
    }

    // componentWillReceiveProps周期是存在期用改变的props
    componentWillReceiveProps(nextProps) {
        this.getVulnerResults(nextProps.field, nextProps.value);  // 刷新页面
    }

    generateResultList(result) {
        let listData = [];
        let index = 0;
        for (let data of result.items) {
            let item = {};
            item.key = index + 1;
            item.index = index + 1;
            item.platform = data.platform.platform;
            item.type = data.type.name;
            item.author = data.author.name;
            item.title = data.description[1];
            item.edb_id = data.edb_id;
            //item.exploit_method_url = data.exploit_method_url;
            item.date_published = data.date_published;
            listData.push(item);
            index++;
        }
        return listData;
    }

    getResultsCB = (data) => {
        if ((typeof data === "undefined") || (data.payload.items.length === 0)) {
            return [];
        }
        let currentPage = (data.payload.items.length % 10 == 0) ? (data.payload.items.length / 10) : (data.payload.items.length / 10 + 1);

        this.setState({
            resultRecordData: this.generateResultList(data.payload),
            totalResult: data.payload.total,
            currentPage,
        });
    }

    getVulnerResults(currentPage, pageSize, field, value) {
        this.setState({
            resultRecordData: [],
        });
        HttpRequest.asyncGet2(this.getResultsCB, '/edb/search', { field: field, value: value, offset: 0, count: pageSize * currentPage });
    }

    /** 处理页面变化（页面跳转/切换/每页记录数变化） */
    handlePageChange = (currentPage, pageSize) => {
        this.getVulnerResults(currentPage, pageSize, this.props.field, this.props.value);
    }

    callback = (key) => {
        console.log(key);
    }

    getVulnerInfo = (rowData) => {
        const resultRecordData = this.state.resultRecordData;
        for (let data of resultRecordData) {
            if (data.key === rowData.key) {
                return data;
            }
        }
        return null;
    }

    getVulnerProContentCB = (data) => {
        if (data.payload !== undefined) {
            Modal.info({
                title: '文件名： ' + data.payload.aliases,
                keyboard: true,         // 是否支持键盘 esc 关闭
                destroyOnClose: true,   // 关闭时销毁 Modal 里的子元素
                closable: false,         // 是否显示右上角的关闭按钮
                width: 800,
                content: (
                    <div>
                        {data.payload.content}
                    </div>
                ),
                onOk() {
                    // message.info('OK');
                },
            });
        }
    }

    selectRow = (rowData) => {
        let vulner = this.getVulnerInfo(rowData);
        if (vulner !== null) {
            HttpRequest.asyncGet2(this.getVulnerProContentCB, '/edb/poc/fetch', { edb_id: vulner.edb_id });
        }
    }

    render() {
        const { totalResult, columns, resultRecordData, scrollWidth, scrollHeight } = this.state;
        const { classes } = this.props;
        let self = this;
        return (
            <Table
                columns={columns}
                dataSource={resultRecordData}
                bordered={true}
                scroll={{ x: scrollWidth, y: scrollHeight }}
                pagination={{
                    total: totalResult > 0 ? totalResult : 10,
                    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
                    pageSizeOptions: ['10', '20', '30', '40'],
                    defaultPageSize: 10,
                    //showQuickJumper: true,
                    showSizeChanger: true,
                    onChange(current, pageSize) {  //点击改变页数的选项时调用函数，current:将要跳转的页数
                        self.handlePageChange(current, pageSize);
                        
                    },
                    onShowSizeChange(current, pageSize) {  //当几条一页的值改变后调用函数，current：改变显示条数时当前数据所在页；pageSize:改变后的一页显示条数
                        self.handlePageChange(current, pageSize);
                    },
                }}
                onRow={(record) => ({
                    onClick: () => {
                        this.selectRow(record);
                    },
                })}
            />
        )

    }
}

VulnerQueryTable.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(VulnerQueryTable);