import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Card, Table, message, Modal } from 'antd';
import moment from 'moment';

import { GetMainViewHeight, GetMainViewMinHeight, GetMainViewMinWidth } from '../../utils/PageUtils'
import HttpRequest from '../../utils/HttpRequest';
import { GetNowTimeMyStr } from '../../utils/TimeUtils'
import EllipsisText from '../../components/widgets/EllipsisText';
import { DeepClone, DeepCopy } from '../../utils/ObjUtils'
import { errorCode } from '../../global/error'

import ExecCountPieChart from './ExecCountPieChart'

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
});

class ExecActionsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resultData: [],
            scrollWidth: 1500,        // 表格的 scrollWidth
            scrollHeight: 1300,      // 表格的 scrollHeight
        };

        this.queryOperation();
    };

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

    getUniqueValues = (dataList, key) => {
        let values = [];
        for (let item of dataList) {
            if (values.indexOf(item[key]) < 0) {
                values.push(item[key]);
            }
        }
        return values;
    }

    getFilters = (dataList, key) => {
        let values = [];
        for (let item of dataList) {
            if ((item[key].length > 0) && (values.indexOf(item[key]) < 0)) {
                values.push(item[key]);
            }
        }
        return values.map(item => { return { text: item, value: item }; });
    }

    popupPieChart(title, source) {
        Modal.info({
            title: title,
            keyboard: true,         // 是否支持键盘 esc 关闭
            destroyOnClose: true,   // 关闭时销毁 Modal 里的子元素
            closable: false,         // 是否显示右上角的关闭按钮
            width: 920,
            content: <ExecCountPieChart source={source} />,
            onOk() {
                // message.info('OK');
            },
        });
    }

    queryExecCountByTaskCB = (taskName) => (data) => {
        let pieData = [];
        pieData = data.payload.map(item => {
            let selected = item.task_name === taskName ? true : false;
            return { 'value': item.exec_count, 'name': item.task_name, selected: selected };
        });
        this.popupPieChart("任务执行比例--按任务名称", pieData);
    }

    handleClickTaskName = (taskName) => (event) => {
        // message.info(taskName);
        HttpRequest.asyncGet(this.queryExecCountByTaskCB(taskName), '/actions/count-by-task');
    }

    queryExecCountByOperatorCB = (operatorName) => (data) => {
        let pieData = [];
        pieData = data.payload.map(item => {
            let selected = item.operator_name === operatorName ? true : false;
            return { 'value': item.exec_count, 'name': item.operator_name, selected: selected };
        });
        this.popupPieChart("任务执行比例--按操作员", pieData);
    }

    handleClickOperatorName = (operatorName) => (event) => {
        // message.info(taskName);
        HttpRequest.asyncGet(this.queryExecCountByOperatorCB(operatorName), '/actions/count-by-operator');
    }

    queryExecCountByAssetCB = (assetName) => (data) => {
        let pieData = [];
        pieData = data.payload.map(item => {
            let selected = item.asset_name === assetName ? true : false;
            return { 'value': item.exec_count, 'name': item.asset_name, selected: selected };
        });
        this.popupPieChart("任务执行比例--按资产名称", pieData);
    }

    handleClickAssetName = (assetName) => (event) => {
        // message.info(taskName);
        HttpRequest.asyncGet(this.queryExecCountByAssetCB(assetName), '/actions/count-by-asset');
    }

    queryExecCountByProjectCB = (projectName) => (data) => {
        let pieData = [];
        pieData = data.payload.map(item => {
            let selected = item.project_name === projectName ? true : false;
            return { 'value': item.exec_count, 'name': item.project_name, selected: selected };
        });
        this.popupPieChart("任务执行比例--按项目名称", pieData);
    }

    handleClickProjectName = (projectName) => (event) => {
        // message.info(taskName);
        HttpRequest.asyncGet(this.queryExecCountByProjectCB(projectName), '/actions/count-by-project');
    }

    getTableColumns() {
        const ratio = 1;
        const { resultData } = this.state;
        const tableColumns = [
            {
                title: '序号', dataIndex: 'index', key: 'index', width: 80,
            },
            {
                title: '任务名称', dataIndex: 'task_name', width: 200,
                render: content => <EllipsisText style={{ cursor: "pointer" }}
                    onclick={this.handleClickTaskName(content)}
                    content={content} width={200 * ratio} />,
                // 添加过滤器用于审计
                filters: this.getFilters(resultData, "task_name"),
                filterMultiple: true,
                onFilter: (value, record) => record.task_name.indexOf(value) === 0,
            },
            {
                title: '操作员', dataIndex: 'operator_name', width: 150,
                render: content => <EllipsisText style={{ cursor: "pointer" }}
                    onclick={this.handleClickOperatorName(content)}
                    content={content} width={150 * ratio} />,
                // 添加过滤器用于审计
                filters: this.getFilters(resultData, "operator_name"),
                filterMultiple: true,
                onFilter: (value, record) => record.operator_name.indexOf(value) === 0,
            },
            {
                title: '执行任务时间', dataIndex: 'exec_time', width: 150,
            },
            {
                title: '主机名', dataIndex: 'asset_name', width: 150,
                render: content => <EllipsisText style={{ cursor: "pointer" }}
                    onclick={this.handleClickAssetName(content)}
                    content={content} width={150 * ratio} />,
                // 添加过滤器用于审计
                filters: this.getFilters(resultData, "asset_name"),
                filterMultiple: true,
                onFilter: (value, record) => record.asset_name.indexOf(value) === 0,
            },
            {
                title: '项目名称', dataIndex: 'project_name', width: 150,
                render: content => <EllipsisText style={{ cursor: "pointer" }}
                    onclick={this.handleClickProjectName(content)}
                    content={content} width={150 * ratio} />,
                // 添加过滤器用于审计
                filters: this.getFilters(resultData, "project_name"),
                filterMultiple: true,
                onFilter: (value, record) => record.project_name.indexOf(value) === 0,
            },
        ];
        return tableColumns;
    }

    queryOperationCB = (data) => {
        let operations = data.payload.map((oper, index) => {
            let item = DeepClone(oper);
            // antd 表格需要数据源中含 key 属性
            item.key = index + 1;
            // 表格中索引列（后台接口返回数据中没有此属性）
            item.index = index + 1;
            return item;
        });
        this.setState({ resultData: operations });
    }

    queryOperation = () => {
        return HttpRequest.asyncGet(this.queryOperationCB, '/actions/all-exec-logs');
    }

    getTableProps() {
        const DEFAULT_PAGE_SIZE = 10;
        const { scrollWidth, scrollHeight } = this.state;
        let newScrollHeight = scrollHeight > 500 ? scrollHeight - 80 : scrollHeight;

        const tableProps = {
            columns: this.getTableColumns(),
            rowKey: record => record.uuid,
            dataSource: this.state.resultData,
            scroll: { x: scrollWidth, y: newScrollHeight },
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
        return (
            <div style={{ minWidth: GetMainViewMinWidth(), minHeight: GetMainViewMinHeight() }}>
                <Card title={'操作日志'} style={{ width: '100%', height: '100%' }}
                >
                    <Table {...this.getTableProps()} />
                </Card>

            </div>
        );
    }

}

ExecActionsView.propTypes = {
    classes: PropTypes.object,
};


export default withStyles(styles)(ExecActionsView);

