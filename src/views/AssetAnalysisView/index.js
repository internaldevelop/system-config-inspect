import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react'

import { Card, Skeleton, Select, Table, Spin, Button, Row, Col, Popconfirm, Collapse, message, Modal } from 'antd';

import { renderAssetInfo } from './AssetInfo';
import UsageGauge from './UsageGauge';
import ProcUsageLine from './ProcUsageLine';
import HttpRequest from '../../utils/HttpRequest';
import { OpenSocket, CloseSocket } from '../../utils/WebSocket';
import { errorCode } from '../../global/error';
import { sockMsgType } from '../../global/enumeration/SockMsgType'

const Option = Select.Option;
const Panel = Collapse.Panel;

let socket = null;

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
});

@inject('assetInfoStore')
@observer
class AssetAnalysisView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assets: [],
            selectedAssetId: -1,
            assetInfo: {},
            assetOnline: false,
            loading: false,
        };

        this.acquireAssets();
    }

    componentDidMount() {
        let infoStore = this.props.assetInfoStore;
        socket = OpenSocket('asset_info', this.processAssetRealTimeInfo);
        infoStore.setProcCpu(this.getSourceInital());
        infoStore.setProcMem(this.getSourceInital());
        // infoStore.initProcCpu();
        // infoStore.addProcCpu('System', 0.0);
        // infoStore.initProcMem();
        // infoStore.addProcMem('System', 0.0);
    }

    componentWillUnmount() {
        CloseSocket(socket);
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
    // @action initProcCpu = () => {
    //     this.procCpuPercents = [['procname', 'percent', 'score']];
    // }
    // @action initProcMem = () => {
    //     this.procMemPercents = [['procname', 'percent', 'score']];
    // }
    // @action addProcCpu = (procname, percent) => {
    //     let record = [procname, percent, this.procCpuPercents.length];
    //     this.procCpuPercents.push(record);
    // }
    // @action addProcMem = (procname, percent) => {
    //     let record = [procname, percent, this.procMemPercents.length];
    //     this.procMemPercents.push(record);
    // }

    processAssetRealTimeInfo = (data) => {
        let infoStore = this.props.assetInfoStore;
        let message = JSON.parse(data);
        if (message.type === sockMsgType.ASSET_REAL_TIME_INFO) {
            // payload
            let payload = message.payload;
            // 从payload中提取CPU使用率，存到仓库中
            infoStore.setCpu(payload['CPU usage']);
            // 从payload中提取内存使用率，存到仓库中
            infoStore.setMem(payload['Memory'].freePercent / 100);

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
                return index;
        }
        return -1;
    }

    startNodeSchedulerCB = (data) => {
    }
    startNodeScheduler = (assetUuid) => {
        let params = { asset_uuid: assetUuid, action: 1, info_types: 'Proc CPU Ranking,Proc Memory Ranking,CPU Usage,Mem' };
        HttpRequest.asyncGet(this.startNodeSchedulerCB, '/assets/real-time-info', params);
    }

    stopNodeSchedulerCB = (data) => {
    }
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
            // 设置资产在线状态
            this.setState({ assetInfo: data.payload, assetOnline: true });

            // 启动后台定时任务，扫描终端节点的CPU和内存使用情况
            this.startNodeScheduler(assets[index].uuid);
        }

        this.setState({ loading: false });
    }
    selectAsset(assetUuid) {
        const { assets } = this.state;
        let selectedAssetId = this.assetIndexFromUuid(assetUuid);
        this.setState({ selectedAssetId });
        let assetIp = "http://" + assets[selectedAssetId].ip + ":8191";
        let params = { types: 'System,CPU,Mem,Net Config' };

        this.setState({ loading: true });
        HttpRequest.asyncGetSpecificUrl(this.acquireAssetInfoCB(selectedAssetId), assetIp, '/asset-info/acquire', params);
    }

    onSelectAsset = (value) => {
        this.selectAsset(value);
    }

    getAssetSelectList = () => {
        const { assets, selectedAssetId } = this.state;
        if (assets.length > 0 && selectedAssetId >= 0) {
            return (
                <Select value={assets[selectedAssetId].uuid} style={{ width: 200 }} onChange={this.onSelectAsset}>
                    {assets.map(asset => (
                        <Option value={asset.uuid}>{asset.name}</Option>
                    ))}
                </Select>
            );
        } else {
            return (
                <Select style={{ width: 200 }}>
                </Select>
            );
        }
    }

    render() {
        const { assetOnline, assetInfo } = this.state;
        let infoStore = this.props.assetInfoStore;
        return (
            <div>
                <Spin spinning={this.state.loading} size="large">
                    {/* <Card title="资产扫描" extra={this.getAssetSelectList()} style={{minWidth: '600px', minHeight: '400px'}}> */}
                    <Card title="资产扫描" extra={this.getAssetSelectList()} bodyStyle={{ minWidth: '800px', minHeight: '400px' }}>
                        <Skeleton loading={!assetOnline} active avatar>
                            <Row gutter={8}>
                                <Col span={17}>
                                    <Card type="inner" title="资产信息">
                                        <Row>
                                            <Col span={7}>
                                                <UsageGauge name='CPU' />
                                            </Col>
                                            <Col span={17}>
                                                <ProcUsageLine name='CPU' percents={infoStore.procCpuPercents}/>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col span={7}>
                                                <UsageGauge name='内存' />
                                            </Col>
                                            <Col span={17}>
                                                <ProcUsageLine name='内存'  percents={infoStore.procMemPercents} />
                                            </Col>
                                        </Row>
                                    </Card>
                                </Col>
                                <Col span={7}>
                                    <Card type="inner" title="资产环境">
                                        {renderAssetInfo(assetInfo)}
                                    </Card>
                                </Col>
                            </Row>
                        </Skeleton>
                    </Card>
                </Spin>
            </div>
        );
    }
}

AssetAnalysisView.propTypes = {
    classes: PropTypes.object,
};


export default withStyles(styles)(AssetAnalysisView);
