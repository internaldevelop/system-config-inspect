import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Card, Skeleton, Select, Table, Spin, Button, Row, Col, Popconfirm, Collapse, message, Modal } from 'antd';

import { renderAssetInfo } from './AssetInfo';
import HttpRequest from '../../utils/HttpRequest';
import { errorCode } from '../../global/error';

const Option = Select.Option;
const Panel = Collapse.Panel;

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
            assetInfo: {},
            assetOnline: false,
            loading: false,
        };

        this.acquireAssets();
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

    acquireAssetInfoCB = (index) => (data, error) => {
        const { assets } = this.state;
        if ((typeof (error) !== 'undefined') && (error !== null)) {
            Modal.error({
                keyboard: true,         // 是否支持键盘 esc 关闭
                content: '访问资产（' + assets[index].name + '）失败，请确认该资产连线状态。',
            });
            this.setState({ assetOnline: false });
        } else {
            this.setState({ assetInfo: data.payload, assetOnline: true });
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
        return (
            <div>
                <Spin spinning={this.state.loading} size="large">
                    <Card title="资产扫描" extra={this.getAssetSelectList()}>
                        <Skeleton loading={!assetOnline} active avatar>
                            <Row gutter={8}>
                                <Col span={17}>
                                    <Card type="inner" title="资产信息">

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
