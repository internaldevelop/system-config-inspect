import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react'

import { Tabs, Card, Skeleton, Select, Input, Spin, Button, Row, Col, Icon, Collapse, message, Modal } from 'antd';

import { renderAssetInfo } from './AssetInfo';
import ProcUsageLine from '../AssetOverView/ProcUsageLine';
import NetWorkStatus from './NetWorkStatus';
import HistoryUsageLine from './HistoryUsageLine';
import UsageGauge from '../AssetOverView/UsageGauge';
import HttpRequest from '../../utils/HttpRequest';
import { isValidAccount } from '../../utils/ObjUtils';
import { OpenSocket, CloseSocket } from '../../utils/WebSocket';
import { errorCode } from '../../global/error';
import { sockMsgType } from '../../global/enumeration/SockMsgType'
import { GetBackEndRootUrl } from '../../global/environment'

const Option = Select.Option;
const Panel = Collapse.Panel;
const { TabPane } = Tabs;

let socket = null;

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
    cardContainer: {
        //height: 120,
        marginTop: -16,
    }
});

@inject('assetInfoStore')
@observer
class PerformanceOverView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assets: [],
            selectedAssetId: -1,
            assetInfo: {},
            assetOnline: false,
            loading: false,
            isWindows: false,
            showSetPwd: false,
        };

        this.acquireAssets();
    }

    componentDidMount() {
        let infoStore = this.props.assetInfoStore;
        socket = OpenSocket('asset_info', this.processAssetRealTimeInfo);
        infoStore.setProcCpu(this.getSourceInital());
        infoStore.setProcMem(this.getSourceInital());

        // 注册事件
        global.myEventEmitter.addListener('DisplayPortsList', this.displayPortsList);
    }

    componentWillUnmount() {
        CloseSocket(socket);

        // 取消事件
        global.myEventEmitter.removeListener('DisplayPortsList', this.displayPortsList);
    }

    displayPortsList = () => {
    }

    getSourceInital = () => {
        return [['procname', 'percent', 'score']];
    }

    acquireAssetsCB = (data) => {
        this.setState({ assets: data.payload });

        let selectedAsset = '';
        if ((data.payload instanceof Array) && (data.payload.length > 0)) {
            selectedAsset = data.payload[0].uuid;
            this.selectAsset(selectedAsset);
        }
    }
    acquireAssets = () => {
        HttpRequest.asyncGet(this.acquireAssetsCB, '/assets/all');
    }

    processAssetRealTimeInfo = (data) => {
        const { assets, selectedAssetId } = this.state;

        let infoStore = this.props.assetInfoStore;
        let message = JSON.parse(data);
        if (message.type === sockMsgType.ASSET_REAL_TIME_INFO && selectedAssetId > -1 && assets.length > 0) {
            // payload
            let payload = message.payload;
            // 不是当前选择的资产信息忽略
            if (payload['asset_uuid'] !== assets[selectedAssetId].uuid) {
                return;
            }

            // 从payload中提取CPU使用率，存到仓库中
            infoStore.setCpu(payload['CPU usage']);
            // 从payload中提取内存使用率，存到仓库中
            infoStore.setMem(payload['Memory'].usedPercent / 100);

            // 从payload中提取硬盘使用率，存到仓库中
            infoStore.setDisk(payload['FST'].usedPercentTotal / 100);

            // 存储进程的CPU占用率
            let procCpuList = payload['Proc CPU Ranking'];
            // let cpuCount = payload['CPU percents'].length;
            if (procCpuList instanceof Array) {
                let procPercents = this.getSourceInital();
                // this.props.assetInfoStore.initProcCpu();
                for (let procCpu of procCpuList) {
                    let percent = (procCpu.percent * 100).toFixed(2) - 0;
                    let procName = procPercents.length + '-' + procCpu.name;
                    procPercents.push([procName, percent, percent]);
                    // infoStore.addProcCpu(procCpu.name, procCpu.percent);
                }
                infoStore.setProcCpu(procPercents);
            }

            // 存储进程的内存占用率
            let procMemList = payload['Proc Memory Ranking'];
            if (procMemList instanceof Array) {
                // this.props.assetInfoStore.initProcMem();
                let procPercents = this.getSourceInital();
                for (let procMem of procMemList) {
                    let procName = procPercents.length + '-' + procMem.name;
                    let percent = (procMem.percent * 100).toFixed(2) - 0;
                    procPercents.push([procName, percent, percent]);
                    // infoStore.addProcMem(procMem.name, procMem.percent);
                }
                infoStore.setProcMem(procPercents);
            }
        } else {
            // 其它消息类型不做处理
        }

    }

    assetNameFromUuid(assetUuid) {
        const { assets } = this.state;
        for (let asset of assets) {
            if (asset.uuid === assetUuid)
                return asset.name;
        }
        return '';
    }
    assetIndexFromUuid(assetUuid) {
        const { assets } = this.state;
        for (let index in assets) {
            if (assets[index].uuid === assetUuid)
                return parseInt(index);
        }
        return -1;
    }

    startNodeSchedulerCB = (data) => {
    }
    // 启动后台定时任务（定时查询节点实时信息）
    startNodeScheduler = (assetUuid) => {
        let params = { asset_uuid: assetUuid, action: 1, info_types: 'Proc CPU Ranking,Proc Memory Ranking,CPU Usage,Mem,FST' };
        HttpRequest.asyncGet(this.startNodeSchedulerCB, '/assets/real-time-info', params);
    }

    stopNodeSchedulerCB = (data) => {
    }
    // 关闭后台定时任务（定时查询节点实时信息）
    stopNodeScheduler(assetUuid) {
        let params = { asset_uuid: assetUuid, action: 0 };
        HttpRequest.asyncGet(this.startNodeSchedulerCB, '/assets/real-time-info', params);
    }

    acquireAssetInfoCB = (index) => (data, error) => {
        const { assets } = this.state;
        if ((typeof (error) !== 'undefined') && (error !== null)) {
            Modal.error({
                keyboard: true,         // 是否支持键盘 esc 关闭
                content: '访问资产（' + assets[index].name + '）失败，请确认该资产连线状态。',
            });
            // 设置资产离线状态
            this.setState({ assetOnline: false });
        } else {
            let isWindows = data.payload.System['os.name'].indexOf('Windows') >= 0;
            // 设置资产在线状态
            this.setState({ assetInfo: data.payload, assetOnline: true, isWindows });

            // 启动后台定时任务，扫描终端节点的CPU和内存使用情况
            this.startNodeScheduler(assets[index].uuid);
        }

        this.setState({ loading: false });
    }
    selectAsset(assetUuid) {
        const { assets, selectedAssetId } = this.state;
        // 停止旧的资产定时任务
        if (selectedAssetId >= 0) {
            this.stopNodeScheduler(assets[selectedAssetId].uuid);
        }

        // 新选择的资产UUID在列表中的索引
        let curSelectId = this.assetIndexFromUuid(assetUuid);

        // 保存新的资产索引
        this.setState({ selectedAssetId: curSelectId });

        // 获取新选择资产的系统信息
        this.setState({ loading: true });
        let assetIp = "http://" + assets[curSelectId].ip + ":8191";
        let params = { types: 'System,CPU,Mem,Net Config,Port,FST' };
        HttpRequest.asyncGetSpecificUrl(this.acquireAssetInfoCB(curSelectId), assetIp, '/asset-info/acquire', params);
    }

    onSelectAsset = (value) => {
        this.selectAsset(value);
    }

    saveFormRef = formRef => {
        this.formRef = formRef;
    };

    // 导出报告
    exportTasksResults = () => {
        const { inputValue, selectValue } = this.state;
        window.location.href = GetBackEndRootUrl() + '/tasks/results/export?taskNameIpType=' + inputValue + '&type=' + selectValue;
    }

    getAssetSelectList = () => {
        const { assets, selectedAssetId, isWindows, assetOnline, showSetPwd } = this.state;
        if (assets.length > 0 && selectedAssetId >= 0) {
            return (
                <span>
                    <span>选择资产</span>
                    <Select value={assets[selectedAssetId].uuid} style={{ width: 200, marginLeft: '16px' }} onChange={this.onSelectAsset}>
                        {assets.map(asset => (
                            <Option value={asset.uuid}>{asset.name}</Option>
                        ))}
                    </Select>
                    <span>
                        <Button size={'large'} disabled={!assetOnline} type='primary' style={{ marginLeft: '16px' }} onClick={this.exportTasksResults} ><Icon type="export" />导出报告</Button>
                    </span>
                </span>
            );
        } else {
            return (
                <Select style={{ width: 200 }}>
                </Select>
            );
        }
    }

    render() {
        const { assetOnline, assetInfo, selectedAssetId, assets } = this.state;
        let infoStore = this.props.assetInfoStore;
        const { classes } = this.props
        let assetName = selectedAssetId >= 0 ? assets[selectedAssetId].name : '';
        let assetUuid = selectedAssetId >= 0 ? assets[selectedAssetId].uuid : '';
        return (
            <div>
                <Spin spinning={this.state.loading} size="large">
                    <Card title="性能测试" extra={this.getAssetSelectList()} bodyStyle={{ minWidth: '800px', minHeight: '400px' }}>
                        <Skeleton loading={!assetOnline} active avatar>
                            <Row gutter={8}>
                                <Col span={17} className={classes.cardContainer}>
                                    <Tabs onChange={this.changeTabs} type="card">
                                        <TabPane tab="CPU" key="1">
                                            <Row>
                                                <Col span={7}>
                                                    <UsageGauge name='CPU' />
                                                </Col>
                                                <Col span={17}>
                                                    <ProcUsageLine name='CPU' percents={infoStore.procCpuPercents} />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <HistoryUsageLine type='dataSrcFromNow' name='CPU' />
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tab="内存" key="2">
                                            <Row>
                                                <Col span={7}>
                                                    <UsageGauge name='内存' />
                                                </Col>
                                                <Col span={17}>
                                                    <ProcUsageLine name='内存' percents={infoStore.procMemPercents} />
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col>
                                                    <HistoryUsageLine type='dataSrcFromNow' name='内存' />
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tab="硬盘" key="3">
                                            <Row>
                                                <Col span={7}>
                                                    <UsageGauge name='硬盘' />
                                                </Col>
                                                <Col span={17}>
                                                    <HistoryUsageLine type='dataSrcFromNow' name='硬盘' />
                                                </Col>
                                            </Row>
                                        </TabPane>
                                        <TabPane tab="网络" key="4">
                                            <Row>
                                                <Col>
                                                <NetWorkStatus asset_uuid={assetUuid}></NetWorkStatus>
                                                </Col>
                                            </Row>
                                        </TabPane>
                                    </Tabs>
                                </Col>
                                <Col span={7} className={classes.cardContainer}>
                                    {renderAssetInfo(assetInfo)}
                                </Col>
                            </Row>
                        </Skeleton>
                    </Card>
                </Spin>
            </div>
        );
    }
}

PerformanceOverView.propTypes = {
    classes: PropTypes.object,
};


export default withStyles(styles)(PerformanceOverView);
