import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Card, DatePicker, Row, Col, Skeleton, Table, Layout, Select, Input, Button } from 'antd';
import moment from 'moment';
import { observer, inject } from 'mobx-react'

import { GetMainViewHeight, GetMainViewMinHeight, GetMainViewMinWidth } from '../../utils/PageUtils'
import HttpRequest from '../../utils/HttpRequest';
import { GetNowTimeMyStr } from '../../utils/TimeUtils'
import EllipsisText from '../../components/widgets/EllipsisText';
import { errorCode } from '../../global/error'
import { DeepClone } from '../../utils/ObjUtils'

const { RangePicker } = DatePicker;
const { Option } = Select;

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
});

@observer
@inject('userStore')
class CheckResultView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resultData: [],
            assetList: [],
            beginTime: '2019-01-01 00:00:00',
            endTime: GetNowTimeMyStr(),
            scanResult: '',
            scrollWidth: 1000,        // 表格的 scrollWidth
            scrollHeight: 500,      // 表格的 scrollHeight
            loading: false,     // 表格数据在加载完成前为 true，加载完成后是 false
            selectedAssets: '',
        };

        // 从后台获取设备数据的集合
        this.getAllAssets();

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
        const tableColumns = [
            {
                title: '序号', dataIndex: 'index', key: 'index', width: 50,
            },
            {
                title: '主机名', dataIndex: 'asset_name', width: 120,
                render: content => <EllipsisText content={content} width={120} />,
            },
            {
                title: '主机ip', dataIndex: 'asset_ip', width: 150,
                render: content => <EllipsisText content={content} width={150} />,
            },
            {
                title: '操作员', dataIndex: 'creator_name', width: 120,
                render: content => <EllipsisText content={content} width={120} />,
            },
            {
                title: '扫描时间', dataIndex: 'create_time', width: 200,
                render: content => <EllipsisText content={content} width={200} />,
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

    handleAssetSelectChange = (value) => {
        // console.log(`Selected: ${value}`);
        this.setState({ selectedAssets: value });
    }

    getAssetSelectProps() {
        const assetSelectProps = {
            mode: "tags",
            size: "large",
            placeholder: "选择资产",
            defaultValue: [],
            onChange: this.handleAssetSelectChange.bind(this),
            style: { width: '100%' },
        };
        return assetSelectProps;
    }

    handleScanResultChange = (event) => {
        this.setState({ scanResult: event.target.value });
    }

    queryResultHistoryCB = (data) => {
        if (data.code === errorCode.ERROR_OK) {
            let results = data.payload.map((result, index) => {
                let item = DeepClone(result);
                // antd 表格的 key 属性复用 index
                // 表格中索引列（后台接口返回数据中没有此属性）
                item.index = index + 1;
                return item;
            });
            this.setState({ resultData: results, loading: false });
        } else {
            this.setState({ loading: false });
        }
    }

    queryResultHistory = () => {
        this.setState({ loading: true });

        const { beginTime, endTime, selectedAssets } = this.state;
        let assetUuidList = "";
        for (let uuid of selectedAssets)
            assetUuidList += uuid + ",";
        let params = {
            begin_time: beginTime,
            end_time: endTime,
            asset_uuid_list: assetUuidList,
            //scan_result: scanResult
        };

        return HttpRequest.asyncPost(this.queryResultHistoryCB, '/baseline-check/get-scan-records', params, false);
    }

    /** 从后台请求所有设备数据，请求完成后的回调 */
    getAllAssetsCB = (data) => {
        let assetList = data.payload.map((item) => <Option key={item.uuid}>{item.name}</Option>);
        this.setState({ assetList });
    }

    /** 从后台请求所有设备数据 */
    getAllAssets = () => {
        // 从后台获取任务的详细信息，含任务表的数据和关联表的数据
        HttpRequest.asyncGet(this.getAllAssetsCB, '/assets/all');
    }

    render() {
        const userStore = this.props.userStore;
        return (
            <Skeleton loading={userStore.isAdminUser} active avatar paragraph={{ rows: 12 }}>
                <div style={{ minWidth: GetMainViewMinWidth(), minHeight: GetMainViewMinHeight() }}>
                    <Card title={'资产扫描日志'} style={{ width: '100%', height: '100%' }}
                        extra={<Button type="primary" icon="search" loading={this.state.loading} onClick={this.queryResultHistory}>查询</Button>}
                    >
                        <Row>
                            <Col span={12}>
                                {/* <Card type="inner" bordered={false} style={{ width: 300 }}> */}
                                选择时间（起止时间段）<RangePicker {...this.getRangePickerProps()} />
                                {/* </Card>
                    <Card type="inner" bordered={false} style={{ width: '100%' }}> */}
                            </Col>
                            <Col span={10} offset={2}>
                                <Select {...this.getAssetSelectProps()} allowClear>
                                    {this.state.assetList}
                                </Select>
                            </Col>
                        </Row>
                        <br /><br />
                        <Table {...this.getTableProps()} />
                    </Card>
                </div >
            </Skeleton>
        );
    }
};

CheckResultView.propTypes = {
    classes: PropTypes.object,
};


export default withStyles(styles)(CheckResultView);
