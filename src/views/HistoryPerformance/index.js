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
import HistoryUsageLine from '../PerformanceOverView/HistoryUsageLine';

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
@inject('assetInfoStore')
class HistoryPerformance extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assets: [],
            beginTime: this.getNowTime(), // 设置beginTime为当天
            endTime: GetNowTimeMyStr(),
            loading: false,     // 图表加载完成前为 true，加载完成后是 false
            selectedAssetUuid: '',
        };
        // 从后台获取设备数据的集合
        this.acquireAssets();
    };

    getNowTime = () => {
        let now = new Date();
        let month = (10 > (now.getMonth() + 1)) ? '0' + (now.getMonth() + 1) : now.getMonth() + 1;
        let day = (10 > now.getDate()) ? '0' + now.getDate() : now.getDate();
        let today = now.getFullYear() + '-' + month + '-' + day;
        return today + ' 00:00:00';
    }

    acquireAssetsCB = (data) => {
        this.setState({ assets: data.payload });
        let selectedAssetUuid = this.state;
        if ((data.payload instanceof Array) && (data.payload.length > 0)) {
            selectedAssetUuid = data.payload[0].uuid;
            this.onSelectAsset(selectedAssetUuid);
            this.setState({ selectedAssetUuid });
        }
    }
    acquireAssets = () => {
        HttpRequest.asyncGet(this.acquireAssetsCB, '/assets/all');
    }

    acquireHistoryCB = (data) => {
        let cpuHistoryList = [];
        let memHistoryList = [];
        let fstHistoryList = [];
        let infoStore = this.props.assetInfoStore;
        if ((data.payload instanceof Array) && (data.payload.length > 0)) {
            for (let item of data.payload) {
                cpuHistoryList.push({ time: item.create_time, value: item.cpu_used_percent });
                memHistoryList.push({ time: item.create_time, value: item.memory_used_percent });
                fstHistoryList.push({ time: item.create_time, value: item.disk_used_percent });
            }
        }
        infoStore.setHistoryCpuPercents(cpuHistoryList);
        infoStore.setHistoryMemPercents(memHistoryList);
        infoStore.setHistoryDiskPercents(fstHistoryList);
    }

    onSelectAsset = (value) => {
        // 获取CPU 内存 硬盘历史性能数据
        this.setState({ selectedAssetUuid: value });
        let params = { asset_uuid: value, begin_time: this.state.beginTime, end_time: this.state.endTime };
        HttpRequest.asyncGet(this.acquireHistoryCB, '/assets-network/his-perf', params);
    }

    onDateTimeChange = (value, dateString) => {
        // console.log('Selected Time: ', value);
        // console.log('Formatted Selected Time: ', dateString);
        this.setState({ beginTime: dateString[0], endTime: dateString[1] });
        let params = { asset_uuid: this.state.selectedAssetUuid, begin_time: dateString[0], end_time: dateString[1] };
        HttpRequest.asyncGet(this.acquireHistoryCB, '/assets-network/his-perf', params);
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

    render() {
        const userStore = this.props.userStore;
        const { assets, selectedAssetUuid } = this.state;
        return (
            <Skeleton loading={userStore.isAdminUser} active avatar paragraph={{ rows: 12 }}>
                <div style={{ minWidth: GetMainViewMinWidth(), minHeight: GetMainViewMinHeight() }}>
                    <Card title={'历史性能数据'} style={{ width: '100%', height: '100%' }} >
                        <Row>
                            <Col span={12}>
                                {/* <Card type="inner" bordered={false} style={{ width: 300 }}> */}
                                选择时间（起止时间段）<RangePicker {...this.getRangePickerProps()} />
                                {/* </Card>
                    <Card type="inner" bordered={false} style={{ width: '100%' }}> */}
                            </Col>
                            <Col span={10} offset={2}>
                                <Select value={selectedAssetUuid} style={{ width: '100%' }} onChange={this.onSelectAsset}>
                                    {assets.map(asset => (
                                        <Option value={asset.uuid}>{asset.name}</Option>
                                    ))}
                                </Select>
                            </Col>
                        </Row>
                        <br /><br />
                        <Row>
                            <Col>
                                <HistoryUsageLine type='dataSrcFromDB' name='CPU' />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <HistoryUsageLine type='dataSrcFromDB' name='内存' />
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <HistoryUsageLine type='dataSrcFromDB' name='硬盘' />
                            </Col>
                        </Row>
                    </Card>
                </div >
            </Skeleton>
        );
    }
};

HistoryPerformance.propTypes = {
    classes: PropTypes.object,
};


export default withStyles(styles)(HistoryPerformance);
