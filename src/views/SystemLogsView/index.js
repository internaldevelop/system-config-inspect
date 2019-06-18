
import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { observer, inject } from 'mobx-react'

import { Skeleton, Card, Table, Select } from 'antd'
import { GetMainViewHeight, GetMainViewMinHeight, GetMainViewMinWidth } from '../../utils/PageUtils'
import EllipsisText from '../../components/widgets/EllipsisText';
import { GetTableColumnFilters } from '../../utils/tools'
import { DeepClone, DeepCopy } from '../../utils/ObjUtils'
import HttpRequest from '../../utils/HttpRequest';

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginLeft: 10,
    },
});


@observer
@inject('userStore')
class SystemLogsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resultData: [],
            scrollWidth: 1500,        // 表格的 scrollWidth
            scrollHeight: 1300,      // 表格的 scrollHeight
        }

        this.querySystemLogs();
    }

    componentDidMount() {
        // 增加监听器，侦测浏览器窗口大小改变
        window.addEventListener('resize', this.handleResize.bind(this));
        this.setState({ scrollHeight: GetMainViewHeight() });
    }

    componentWillUnmount() {
        // 组件卸装前，一定要移除监听器
        window.removeEventListener('resize', this.handleResize.bind(this));
    }

    handleResize = e => {
        this.setState({ scrollHeight: GetMainViewHeight() });
    }

    querySystemLogsCB = (data) => {
        let logs = data.payload.map((log, index) => {
            let item = DeepClone(log);
            // antd 表格的 key 属性复用 index
            // 表格中索引列（后台接口返回数据中没有此属性）
            item.index = index + 1;
            return item;
        });
        this.setState({ resultData: logs });
    }

    querySystemLogs = () => {
        return HttpRequest.asyncGet(this.querySystemLogsCB, '/system-logs/all');
    }

    logTypeArray() {
        return ["未知", "成功", "失败", "系统错误", "信息", "异常", "警告",];
    }

    getLogTypeMeaning(type) {
        return this.logTypeArray()[type];
    }

    getTypeColumnFilters = (dataList, key) => {
        let values = [];
        for (let item of dataList) {
            let meaning = this.getLogTypeMeaning(item[key]);
            if ((meaning.length > 0) && (values.indexOf(meaning) < 0)) {
                values.push(meaning);
            }
        }
        return values.map(item => { return { text: item, value: item }; });
    }

    getTableColumns() {
        const ratio = 1;
        const { resultData } = this.state;
        const tableColumns = [
            {
                title: '序号', dataIndex: 'index', key: 'index', width: 50,
            },
            {
                title: '类型', dataIndex: 'type', width: 80,
                render: content => this.getLogTypeMeaning(parseInt(content)),
                // 添加过滤器用于审计
                filters: this.getTypeColumnFilters(resultData, "type"),
                filterMultiple: true,
                onFilter: (value, record) => this.getLogTypeMeaning(record.type).indexOf(value) === 0,
            },
            {
                title: '标题', dataIndex: 'title', width: 100,
                // 添加过滤器用于审计
                filters: GetTableColumnFilters(resultData, "title"),
                filterMultiple: true,
                onFilter: (value, record) => record.title.indexOf(value) === 0,
            },
            {
                title: '日志内容', dataIndex: 'contents', width: 300,
                render: content => <EllipsisText content={content} width={300 * ratio} />,
            },
            {
                title: '用户名', dataIndex: 'create_user_name', width: 100,
                // 添加过滤器用于审计
                filters: GetTableColumnFilters(resultData, "create_user_name"),
                filterMultiple: true,
                onFilter: (value, record) => record.create_user_name.indexOf(value) === 0,
            },
            {
                title: '用户账号', dataIndex: 'create_user_account', width: 100,
                // 添加过滤器用于审计
                filters: GetTableColumnFilters(resultData, "create_user_account"),
                filterMultiple: true,
                onFilter: (value, record) => record.create_user_account.indexOf(value) === 0,
            },
            {
                title: '时间', dataIndex: 'create_time', width: 130,
            },
        ];
        return tableColumns;
    }

    getTableProps() {
        const DEFAULT_PAGE_SIZE = 10;
        const { scrollWidth, scrollHeight, resultData } = this.state;
        let newScrollHeight = scrollHeight > 500 ? scrollHeight - 80 : scrollHeight;

        const tableProps = {
            columns: this.getTableColumns(),
            rowKey: record => record.uuid,
            dataSource: resultData,
            // scroll: { x: scrollWidth, y: newScrollHeight },
            scroll: { y: newScrollHeight },
            bordered: true,
            pagination: {
                showTotal: (total, range) => `${range[0]}-${range[1]} / ${total}`,
                pageSizeOptions: [DEFAULT_PAGE_SIZE.toString(), '20', '50'],
                defaultPageSize: DEFAULT_PAGE_SIZE,
                showQuickJumper: true,
                showSizeChanger: true,
            }
        };
        return tableProps;
    }

    render() {
        const userStore = this.props.userStore;
        return (
            <Skeleton loading={userStore.isAuditUser} active avatar paragraph={{ rows: 12 }}>
                <div style={{ minWidth: GetMainViewMinWidth(), minHeight: GetMainViewMinHeight() }}>
                    <Card title={'操作日志'} style={{ width: '100%', height: '100%' }}
                    >
                        <Table {...this.getTableProps()} />
                    </Card>
                </div>

            </Skeleton>
        );
    }
}

SystemLogsView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(SystemLogsView);
