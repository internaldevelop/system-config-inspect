import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { observer, inject } from 'mobx-react'

import { message, Select, Col, Spin, Card, Form, Input, Row, Button, Icon } from 'antd';
import HttpRequest from '../../utils/HttpRequest';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

const styles = theme => ({
    root: {
        width: '90%',
    },

});
let delay_select = '';
let communicate_select = '';
let capacity_select = '';
let pingIP = '';
let targetURL = '';
let timer3S = undefined;    // 3秒的定时器

@inject('assetInfoStore')
@observer
@Form.create()
class NetWorkStatus extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            assets: [],
            selectedAssetId: -1,
        };
        this.acquireAssets();
    }

    acquireAssetsCB = (data) => {
        this.setState({ assets: data.payload });
    }

    acquireAssets = () => {
        HttpRequest.asyncGet(this.acquireAssetsCB, '/assets/all');
    }

    onSelectDelayAsset = (value) => {
        delay_select = value;
    }

    onSelectCapacityAsset = (value) => {
        capacity_select = value;
    }

    onSelectCommunicateAsset = (value) => {
        communicate_select = value;
    }

    getPingResultCB = (data, error) => {
        let success = true;
        if (data.payload !== null && data.payload !== undefined) {
            if (data.payload['isconnect'] !== null && data.payload['isconnect'] !== undefined) {
                if (data.payload['isconnect'] === '1' ) {
                    document.getElementById('ping_result').value = "可以PING通 " + pingIP;
                } else {
                    document.getElementById('ping_result').value = "PING " + pingIP + " 失败";
                }
            } else {
                success = false;
            }
        } else {
            success = false;
        }
        this.setState({ loading: false });
    }

    startTimer = () => {
        // 开启3秒的定时器
        timer3S = setInterval(() => this.timer3sProcess(), 3000);
    }

    timer3sProcess = () => {
        this.setState({ loading: false });
    }

    getPingResult = () => {
        let success = true;
        document.getElementById('ping_result').value = '';
        this.props.form.validateFields((err, values) => {
            if (err !== null) {
                success = false;
            } else {
                if (values.pingIP !== '' && values.pingIP !== undefined) {
                    pingIP = values.pingIP;
                    let params = { asset_uuid: this.props.asset_uuid, ip: values.pingIP };
                    HttpRequest.asyncGet(this.getPingResultCB, '/netconnect/ping', params);
                    this.setState({ loading: true });
                    this.startTimer();
                }
            }
        });
    }

    getURLResultCB = (data, error) => {
        let success = true;
        if (data.payload !== null && data.payload !== undefined) {
            if (data.payload['total_time'] !== null && data.payload['total_time'] !== undefined) {
                document.getElementById('url_result').value = "访问" + targetURL + "时间为 "  + data.payload['total_time'] + "ms";
            } else {
                success = false;
            }
        } else {
            success = false;
        }
        this.setState({ loading: false });
    }

    getURLResult = () => {
        let success = true;
        document.getElementById('url_result').value =  '';
        this.props.form.validateFields((err, values) => {
            if (err !== null) {
                success = false;
            } else {
                if (values.URL !== '' && values.URL !== undefined) {
                    targetURL = values.URL;
                    let params = { asset_uuid: this.props.asset_uuid, url: values.URL };
                    HttpRequest.asyncGet(this.getURLResultCB, '/netconnect/url-resp', params);
                    this.setState({ loading: true });
                    this.startTimer();
                }
            }
        });
    }

    assetNameFromUuid(assetUuid) {
        const { assets } = this.state;
        for (let asset of assets) {
            if (asset.uuid === assetUuid)
                return asset.name;
        }
        return '';
    }

    getNetWorkResultCB = (data, error) => {
        let obj_asset_uuid = delay_select;
        let success = true;
        if (data.payload !== null && data.payload !== undefined && obj_asset_uuid !== '' && obj_asset_uuid !== undefined) {
            let assetName = this.assetNameFromUuid(obj_asset_uuid);
            if (data.payload['tcp_lat'] !== null && data.payload['tcp_lat'] !== undefined) {
                document.getElementById('delay_result').value = "当前节点与" + assetName + "节点网络延时为：" + data.payload['tcp_lat'];
            } else if (data.payload['tcp_bw_throughput'] !== null && data.payload['tcp_bw_throughput'] !== undefined) {
                document.getElementById('capacity_result').value = "当前节点与" + assetName + "节点吞吐量为：" + data.payload['tcp_bw_throughput'];
            } else if (data.payload['tcp_bw'] !== null && data.payload['tcp_bw'] !== undefined) {
                document.getElementById('communicate_result').value = "当前节点与" + assetName + "节点带宽为：" + data.payload['tcp_bw'];
            } else {
                success = false;
            }
        } else {
            success = false;
        }
        this.setState({ loading: false });
        if (!success) {
            message.info('目标节点缺少环境或者没有上线，请重新选择');
        }
    }

    getNetWorkResult = (networkType) => (event) => {
        let success = true;
        this.props.form.validateFields((err, values) => {
            if (err !== null) {
                success = false;
            } else {
                let obj_asset_uuid = delay_select;
                switch (networkType) {
                    case 1:
                        document.getElementById('delay_result').value = '';
                        obj_asset_uuid = delay_select;
                        break;
                    case 2:
                        document.getElementById('capacity_result').value = '';
                        obj_asset_uuid = capacity_select;
                        break;
                    case 3:
                        document.getElementById('communicate_result').value = '';
                        obj_asset_uuid = communicate_select;
                        break;
                }
                // this.props.asset_uuid 为当前节点，测试与选择的节点之间的网络延时
                if (obj_asset_uuid !== '' && obj_asset_uuid !== undefined) {
                    let params = { source_asset_uuid: this.props.asset_uuid, obj_asset_uuid: obj_asset_uuid, type: networkType };
                    HttpRequest.asyncGet(this.getNetWorkResultCB, '/assets-network/delay', params);
                    this.setState({ loading: true });
                    this.startTimer();
                }
            }
        });
    }

    render() {
        const { assets } = this.state;
        const { classes } = this.props;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: { span: 12 },
                sm: { span: 4 },
                md: { span: 3 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 12 },
            },
        };
        return (
            <div>
                <Spin spinning={this.state.loading} size="large">
                    <Form layout='horizontal'>
                        <Card type="inner" title='连通性检测' bordered={true} style={{ marginBottom: 16 }}>
                            <Row>
                                <Col span={21}>
                                    <FormItem label='请输入IP或域名: ' {...formItemLayout}>
                                        {
                                            getFieldDecorator('pingIP', {
                                                initialValue: '',
                                                rules: [
                                                    {
                                                        len: 30,
                                                        pattern: /^((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}$|^([a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/,
                                                        message: '请输入正确的IP地址'
                                                    }
                                                ]
                                            })(
                                                <Input allowClear />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={3} align="right">
                                    <Button type='primary' onClick={this.getPingResult} >PING</Button>
                                </Col>
                            </Row>
                            <TextArea rows={2} readOnly id='ping_result' />
                        </Card>
                        <Card type="inner" title='指定URL访问检测' bordered={true} style={{ marginBottom: 16 }}>
                            <Row>
                                <Col span={21}>
                                    <FormItem label='请输入URL地址:' {...formItemLayout}>
                                        {
                                            getFieldDecorator('URL', {
                                                initialValue: '',
                                                rules: [
                                                    {
                                                        len: 50,
                                                        pattern: /^((ht|f)tps?):\/\/[\w\-]+(\.[\w\-]+)+([\w\-.,@?^=%&:\/~+#]*[\w\-@?^=%&\/~+#])?$/,
                                                        message: '请输入正确的URL地址'
                                                    }
                                                ]
                                            })(
                                                <Input allowClear />
                                            )
                                        }
                                    </FormItem>
                                </Col>
                                <Col span={3} align="right">
                                    <Button type='primary' onClick={this.getURLResult} >时长检测</Button>
                                </Col>
                            </Row>
                            <TextArea rows={2} readOnly id='url_result' />
                        </Card>
                        <Card type="inner" title='网络延时检测' bordered={true} style={{ marginBottom: 16 }}>
                            <Row>
                                <Col span={20}>
                                    <span>
                                        <span>请选择节点</span>
                                        <Select id='delay_select' style={{ width: 200, marginLeft: '16px' }} onChange={this.onSelectDelayAsset.bind(this)}>
                                            {assets.map(asset => (
                                                <Option value={asset.uuid}>{asset.name}</Option>
                                            ))}
                                        </Select>
                                    </span>
                                </Col>
                                <Col span={4} align="right">
                                    <Button type='primary' onClick={this.getNetWorkResult(1).bind(this)} >延时检测</Button>
                                </Col>
                            </Row>
                            <br />
                            <TextArea rows={2} readOnly id='delay_result' />
                        </Card>
                        <Card type="inner" title='吞吐量检测' bordered={true} style={{ marginBottom: 16 }}>
                            <Row>
                                <Col span={20}>
                                    <span>
                                        <span>请选择节点</span>
                                        <Select style={{ width: 200, marginLeft: '16px' }} onChange={this.onSelectCapacityAsset.bind(this)} >
                                            {
                                                assets.map(asset => (
                                                    <Option value={asset.uuid}>{asset.name}</Option>
                                                ))
                                            }
                                        </Select>
                                    </span>
                                </Col>
                                <Col span={4} align="right">
                                    <Button type='primary' onClick={this.getNetWorkResult(2).bind(this)} >吞吐量检测</Button>
                                </Col>
                            </Row>
                            <br />
                            <TextArea rows={2} readOnly id='capacity_result' />
                        </Card>
                        <Card type="inner" title='通信能力检测' bordered={true} style={{ marginBottom: 16 }}>
                            <Row>
                                <Col span={20}>
                                    <span>
                                        <span>请选择节点</span>
                                        <Select style={{ width: 200, marginLeft: '16px' }} onChange={this.onSelectCommunicateAsset.bind(this)} >
                                            {
                                                assets.map(asset => (
                                                    <Option value={asset.uuid}>{asset.name}</Option>
                                                ))
                                            }
                                        </Select>
                                    </span>
                                </Col>
                                <Col span={4} align="right">
                                    <Button type='primary' onClick={this.getNetWorkResult(3).bind(this)} >带宽检测</Button>
                                </Col>
                            </Row>
                            <br />
                            <TextArea rows={2} readOnly id='communicate_result' />
                        </Card>
                    </Form>
                </Spin>
            </div >
        );
    }

}

NetWorkStatus.propTypes = {
    classes: PropTypes.object.isRequired,
};

NetWorkStatus.contextTypes = {
    router: PropTypes.object.isRequired
};

export default withStyles(styles)(NetWorkStatus);
