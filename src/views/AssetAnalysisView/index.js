import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { observer, inject } from 'mobx-react'

import { Card, Skeleton, Select, Table, Divider, Button, Row, Col, Spin, Collapse, message, Modal, Typography } from 'antd';

import ResultCard from './ResultCard';
import CheckRating from './CheckRating';
import StatStackBar from './StatStackBar';
import StatRadar from './StatRadar';
import { GetGroups } from './toolkit';

import HttpRequest from '../../utils/HttpRequest';
import { OpenSocket, CloseSocket } from '../../utils/WebSocket';
import { getGroupAlias } from '../../utils/StringUtils';
import { errorCode } from '../../global/error';
import { sockMsgType } from '../../global/enumeration/SockMsgType'
import lightBlue from '@material-ui/core/colors/lightBlue';
import teal from '@material-ui/core/colors/teal';

// var EventEmitter = require('events').EventEmitter;
// let emitter = new EventEmitter();

const Option = Select.Option;
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group;
const { Title } = Typography;


let socket = null;

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginBottom: 0,
        marginTop: 0,
    },
});

class AssetAnalysisView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assets: [],
            selectedAssetId: -1,
            hasCheckStat: false,
            scan: null,
            checking: false,
        };

        this.acquireAssets();
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    getRecentCheckStatCB = (data) => {
        this.setState({ hasCheckStat: true, recent: data.payload.recent });
        global.myEventEmitter.emit('RefreshCheckResult', data.payload.statistics);
    }
    getRecentCheckStat = (assetId) => {
        const { assets } = this.state;
        if (assetId < 0)
            return;

        // 清空核查统计数据
        this.setState({ hasCheckStat: false });
        global.myEventEmitter.emit('ClearCheckResult', '');

        let asset = assets[assetId];
        let params = { asset_uuid: asset.uuid };
        HttpRequest.asyncGet(this.getRecentCheckStatCB, '/baseline-check/asset-recent-check-stat', params);
    }

    acquireAssetsCB = (data) => {
        this.setState({ assets: data.payload, selectedAssetId: 0 });

        this.getRecentCheckStat(0);
    }
    acquireAssets = () => {
        HttpRequest.asyncGet(this.acquireAssetsCB, '/assets/all');
    }

    assetIndexFromUuid(assetUuid) {
        const { assets } = this.state;
        for (let index in assets) {
            if (assets[index].uuid === assetUuid)
                return parseInt(index);
        }
        return -1;
    }

    selectAsset(assetUuid) {
        const { assets, selectedAssetId } = this.state;

        // 新选择的资产UUID在列表中的索引
        let curSelectId = this.assetIndexFromUuid(assetUuid);

        // 保存新的资产索引
        this.setState({ selectedAssetId: curSelectId });

        // 获取新选择的资产的核查统计数据
        this.getRecentCheckStat(curSelectId);
    }

    onSelectAsset = (value) => {
        this.selectAsset(value);
    }

    getAssetSelectList = () => {
        const { assets, selectedAssetId } = this.state;
        if (assets.length > 0 && selectedAssetId >= 0) {
            return (
                <span>
                    <span>选择资产</span>
                    <Select value={assets[selectedAssetId].uuid} style={{ width: 200, marginLeft: '16px' }} onChange={this.onSelectAsset}>
                        {assets.map(asset => (
                            <Option value={asset.uuid} key={asset.uuid}>{asset.name}</Option>
                        ))}
                    </Select>
                </span>
            );
        } else {
            return (
                <span>
                    <span>选择资产</span>
                    <Select style={{ width: 200, marginLeft: '16px' }}>
                    </Select>
                </span>
            );
        }
    }

    getTitle = () => {
        const { hasCheckStat, recent } = this.state;
        let title;
        if (hasCheckStat && recent !== null) {
            let level;
            if (recent.base_line === 1) {
                level = '一级';
            } else if (recent.base_line === 2) {
                level = '二级';
            } else if (recent.base_line === 3) {
                level = '三级';
            } else {
                level = '未知级别';
            }
            title = '资产核查--' + level + '（最新核查时间：' + recent.create_time + '）';
        } else {
            title = '资产核查（从未核查）';
        }
        return title;
    }

    execAssetCheckCB = (data) => {
        const { selectedAssetId } = this.state;
        // 获取资产最新的核查统计数据
        this.getRecentCheckStat(selectedAssetId);
        // 设置页面为waiting状态
        this.setState({ checking: false });
    }
    handleCheck = (baseLine) => (event) => {
        console.log();
        const { assets, selectedAssetId } = this.state;
        if (selectedAssetId < 0)
            return;

        // 设置页面为waiting状态
        this.setState({ checking: true });

        // 执行核查
        let asset = assets[selectedAssetId];
        let params = { asset_uuid: asset.uuid, base_line: baseLine };
        HttpRequest.asyncGet(this.execAssetCheckCB, '/baseline-check/run-asset-check', params, false);
    }

    render() {
        const { selectedAssetId, checking } = this.state;
        let groups = GetGroups();
        let title = this.getTitle();

        return (<div style={{ minWidth: 1200 }}>
            <Spin spinning={checking} size="large">
                <Card title={title} extra={this.getAssetSelectList()}>
                    <Row gutter={8}>
                        <Col span={3}>
                            <Card style={{ textAlign: 'center' }} bordered={false}>
                                <Title style={{ textAlign: 'center' }} level={3}>总体评分</Title>
                                <CheckRating />
                            </Card>
                        </Col>
                        {groups.map((group) => <Col span={3}><ResultCard name={group} alias={getGroupAlias(group)} /></Col>)}
                    </Row>
                    <Divider />
                    {selectedAssetId >= 0 &&
                        <Row gutter={8}>
                            <Col span={3}>
                                {/* <Card style={{ backgroundColor: teal[500] }}> */}
                                <Card bordered={false}>
                                    <Title style={{ textAlign: 'center' }} level={3}>核查</Title>
                                    <Button block size={'large'} type='secondary' style={{ marginBottom: 15 }} onClick={this.handleCheck(1).bind(this)}>基线一级</Button>
                                    <Button block size={'large'} type='primary' style={{ marginBottom: 15 }} onClick={this.handleCheck(2).bind(this)}>基线二级</Button>
                                    <Button block size={'large'} type='danger' onClick={this.handleCheck(3).bind(this)}>基线三级</Button>
                                </Card>
                            </Col>
                            <Col span={6}>
                                <StatRadar />
                            </Col>
                            <Col span={15}>
                                <StatStackBar />
                            </Col>
                        </Row>
                    }
                </Card>
            </Spin>
        </div>);
    }
}

AssetAnalysisView.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(AssetAnalysisView);
