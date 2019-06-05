import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Card, DatePicker, Col, Row, Table, Layout, Select, Input, Button } from 'antd';
import moment from 'moment';

import { GetMainViewHeight, GetMainViewMinHeight, GetMainViewMinWidth } from '../../utils/PageUtils'
import HttpRequest from '../../utils/HttpRequest';
import { GetNowTimeMyStr } from '../../utils/TimeUtils'
import EllipsisText from '../../components/widgets/EllipsisText';
import { errorCode } from '../../global/error'

const { RangePicker } = DatePicker;
const { Sider, Content } = Layout;
const { Option } = Select;

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
});

class TaskExecResultsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resultData: [],
            policyList: [],
            beginTime: '2019-01-01 00:00:00',
            endTime: GetNowTimeMyStr(),
            scanResult: '',
            scrollWidth: 2000,        // 表格的 scrollWidth
            scrollHeight: 300,      // 表格的 scrollHeight
            loading: false,     // 表格数据在加载完成前为 true，加载完成后是 false
            selectedPolicies: '',
        };

        this.queryPolicies();

        this.queryResultHistory();
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

    onDateTimeChange = (value, dateString) => {
        // console.log('Selected Time: ', value);
        // console.log('Formatted Selected Time: ', dateString);
        this.setState({ beginTime: dateString[0], endTime: dateString[1] });
    }

    onSetDateTime = (value) => {
        // console.log('onSetDateTime: ', value);
    }

    getRangePickerProps() {
        const timeFormat = "YYYY-MM-DD HH:mm:ss";
        const { beginTime, endTime } = this.state;

        const rangePickerProps = {
            allowClear: false,
            showTime: { format: 'HH:mm' },
            format: timeFormat,
            placeholder: ['Start Time', 'End Time'],
            onChange: this.onDateTimeChange,
            onOk: this.onSetDateTime,
            defaultValue: [moment(beginTime, timeFormat), moment(endTime, timeFormat)],
        };
        return rangePickerProps;
    }

    getTableColumns() {
        const ratio = 1; 
        const tableColumns = [
            {
                title: '策略名称', dataIndex: 'policy_name', width: 200, 
                render: content => <EllipsisText content={content} width={200 * ratio}/>,
            },
            {
                title: '主机名', dataIndex: 'asset_name', width: 200, 
                render: content => <EllipsisText content={content} width={200 * ratio}/>,
            },
            {
                title: '扫描结果', dataIndex: 'risk_desc', width: 250, 
                render: content => <EllipsisText content={content} width={250 * ratio}/>,
            },
            {
                title: '风险等级', dataIndex: 'risk_level', width: 100, 
                render: content => content + ' 级',
            },
            {
                title: '解决方案', dataIndex: 'solutions', width: 250, 
                render: content => <EllipsisText content={content} width={250 * ratio}/>,
            },
            {
                title: '耗时', dataIndex: 'run_time', width: 100, 
                render: content => parseInt(content) === 0 ? '小于 1 秒': '约' + content + '秒',
            },
            {
                title: '策略组', dataIndex: 'policy_group_name', width: 250, 
                render: content => <EllipsisText content={content} width={250 * ratio}/>,
            },
            {
                title: '扫描时间', dataIndex: 'start_time', width: 150, 
                // render: content => content + ' 级',
            },
        ];
        return tableColumns;
    }

    getTableProps() {
        const { scrollWidth, scrollHeight } = this.state;
        let newScrollHeight = scrollHeight > 500 ? scrollHeight - 210 : scrollHeight;

        const tableProps = {
            columns: this.getTableColumns(),
            rowKey: record => record.uuid,
            dataSource: this.state.resultData,
            scroll: { x: scrollWidth, y: newScrollHeight },
            bordered: true,
            // scroll: { y: scrollHeight },
        };
        return tableProps;
    }

    handlePolicySelectChange = (value) => {
        // console.log(`Selected: ${value}`);
        this.setState({ selectedPolicies: value });
    }

    getPolicySelectProps() {
        const policySelectProps = {
            mode: "tags",
            size: "large",
            placeholder: "选择策略",
            defaultValue: [],
            onChange: this.handlePolicySelectChange.bind(this),
            style: { width: '100%' },
        };
        return policySelectProps;
    }

    handleScanResultChange = (event) => {
        this.setState({ scanResult: event.target.value });
    }

    queryResultHistoryCB = (data) => {
        if (data.code === errorCode.ERROR_OK) {
            this.setState({ resultData: data.payload, loading: false });
        } else {
            this.setState({ loading: false });
        }
    }

    queryResultHistory = () => {
        this.setState({ loading: true });

        const { beginTime, endTime, selectedPolicies, scanResult } = this.state;
        let policyUuidList = "";
        for (let uuid of selectedPolicies)
        policyUuidList += uuid + ",";
        let params = {
            begin_time: beginTime,
            end_time: endTime, 
            policy_uuid_list: policyUuidList, 
            scan_result: scanResult
        };

        return HttpRequest.asyncPost(this.queryResultHistoryCB, '/tasks/results/history', params, false);
    }

    queryPoliciesCB = (data) => {
        let policyList = data.payload.map( (item) => <Option key={item.uuid}>{item.name}</Option>);
        this.setState({ policyList });
    }
    queryPolicies = () => {
        return HttpRequest.asyncGet(this.queryPoliciesCB, '/policies/all-brief');
    }

    render() {
        return (
            <div style={{ minWidth: GetMainViewMinWidth(), minHeight: GetMainViewMinHeight() }}>
                <Card title={'主站扫描日志'} style={{ width: '100%', height: '100%' }}
                    extra={<Button type="primary" icon="search" loading={this.state.loading} onClick={this.queryResultHistory}>查询</Button>}
                >
                    <Col xs={10}>
                    {/* <Card type="inner" bordered={false} style={{ width: 300 }}> */}
                        <div>选择时间（起止时间段）</div>
                        <RangePicker {...this.getRangePickerProps()} />
                    {/* </Card>
                    <Card type="inner" bordered={false} style={{ width: '100%' }}> */}
                        </Col>
                    <Col span={12} offset={2}>
                        <div>需要查询的扫描结果</div>
                        <Input allowClear onChange={this.handleScanResultChange} />
                        </Col>
                    {/* </Card>
                    <Card type="inner" bordered={false} style={{ width: '100%' }}> */}
                        <div>选择策略（可多选）</div>
                        <Select {...this.getPolicySelectProps()} allowClear>
                            {this.state.policyList}
                        </Select>
                        <br/><br/>
                        <Table {...this.getTableProps()} />
                </Card>
            </div >
        );
    }
};

TaskExecResultsView.propTypes = {
    classes: PropTypes.object,
};


export default withStyles(styles)(TaskExecResultsView);
