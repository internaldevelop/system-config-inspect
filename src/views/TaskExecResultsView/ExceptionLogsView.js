import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Card, Select, Col, Row, Table, Skeleton, Input, Button } from 'antd';
import moment from 'moment';
import { observer, inject } from 'mobx-react'

import HttpRequest from '../../utils/HttpRequest';
import EllipsisText from '../../components/widgets/EllipsisText';
import { GetMainViewHeight, GetMainViewMinHeight, GetMainViewMinWidth } from '../../utils/PageUtils'
import { DeepClone } from '../../utils/ObjUtils'

const Option = Select.Option;

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
});

@observer
@inject('userStore')
class ExceptionLogsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resultData: [],
            riskLevel: 99,
            // policyList: [],
            // beginTime: '2019-01-01 00:00:00',
            // endTime: GetNowTimeMyStr(),
            // scanResult: '',
            scrollWidth: 2000,        // 表格的 scrollWidth
            scrollHeight: 300,      // 表格的 scrollHeight
            // loading: false,     // 表格数据在加载完成前为 true，加载完成后是 false
            // selectedPolicies: '',
        };

        this.getTaskExecRiskInfo(this.state.riskLevel);
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

    getTableColumns() {
        const ratio = 1;
        const { resultData } = this.state;
        const tableColumns = [
            {
                title: '序号', dataIndex: 'index', key: 'key', width: 60,
            },
            {
                title: '主机名', dataIndex: 'asset_name', width: 120,
                render: content => <EllipsisText content={content} width={120 * ratio} />,
            },
            {
                title: '风险等级', dataIndex: 'risk_level', width: 60,
            },
            {
                title: '风险描述', dataIndex: 'risk_desc', width: 300,
                render: content => <EllipsisText content={content} width={300 * ratio} />,
            },
            {
                title: '任务名称', dataIndex: 'task_name', width: 150,
                render: content => <EllipsisText content={content} width={150 * ratio} />,
            },
            {
                title: '操作员', dataIndex: 'user_name', width: 100,
            },
            {
                title: '执行任务时间', dataIndex: 'start_time', width: 100,
            },
        ];
        return tableColumns;
    }

    getTableProps() {
        const DEFAULT_PAGE_SIZE = 10;
        const { scrollWidth, scrollHeight } = this.state;
        let newScrollHeight = scrollHeight > 300 ? scrollHeight - 80 : scrollHeight;

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

    handleRiskLevelChange = (value) => {
        this.setState({ riskLevel: parseInt(value) });
        this.getTaskExecRiskInfo(parseInt(value));
    }

    getTaskExecRiskInfoCB = (data) => {
        let resultData = data.payload.map((item, index) => {
            let riskItem = DeepClone(item);
            // antd 表格需要数据源中含 key 属性
            riskItem.key = index + 1;
            // 表格中索引列（后台接口返回数据中没有此属性）
            riskItem.index = index + 1;
            return riskItem;
        })
        this.setState({ resultData });
    }

    getTaskExecRiskInfo = (riskLevel) => {
        HttpRequest.asyncGet(this.getTaskExecRiskInfoCB,
            '/tasks/results/risks',
            { exec_action_uuid: '', risk_level: riskLevel });
    }

    riskLevelSelect() {
        return (
            <Select defaultValue='99' style={{ width: 200 }} onChange={this.handleRiskLevelChange.bind(this)}>
                <Option value='99'>全部异常</Option>
                <Option value='1'>风险一级</Option>
                <Option value='2'>风险二级</Option>
                <Option value='3'>风险三级</Option>
            </Select>
        );
    }

    render() {
        const userStore = this.props.userStore;
        return (
            <Skeleton loading={userStore.isAdminUser} active avatar paragraph={{ rows: 12 }}>
                <div style={{ minWidth: GetMainViewMinWidth(), minHeight: GetMainViewMinHeight() }}>
                    <Card title={'异常日志'} style={{ width: '100%', height: '100%' }}
                        extra={this.riskLevelSelect()}
                    >
                        <Table {...this.getTableProps()} />
                    </Card>

                </div>
            </Skeleton>
        );
    }

}

ExceptionLogsView.propTypes = {
    classes: PropTypes.object,
};


export default withStyles(styles)(ExceptionLogsView);

