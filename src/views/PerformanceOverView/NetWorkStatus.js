import React, { Component } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { observer, inject } from 'mobx-react'

import { Select, Col, Spin, Card, Form, Input, Row, Button, Icon } from 'antd';
import HttpRequest from '../../utils/HttpRequest';
const FormItem = Form.Item;
const { TextArea } = Input;
const Option = Select.Option;

const styles = theme => ({
    root: {
        width: '90%',
    },

});

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

    onSelectAsset = (value) => {
        let { selectedAssetId } = this.state;
        selectedAssetId = value;
    }

    getPingResultCB = (data, error) => {
        this.setState({ loading: false });
    }

    getPingResult = () => {
        let success = true;
        this.props.form.validateFields((err, values) => {
            if (err !== null) {
                success = false;
            } else {
                //HttpRequest.asyncPost(this.getPingResultCB, '/users/update', newUserData);
                this.setState({ loading: true });
            }
        });
        
    }

    render() {
        const { assets } = this.state;
        const { classes } = this.props;
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
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
                                <Col span={17}>
                                    <FormItem label='请输入IP或域名: ' {...formItemLayout}>
                                        {
                                            getFieldDecorator('IP', {
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
                                <Col offset={1} span={6}>
                                    <Button type='primary' onClick={this.getPingResult} >PING</Button>
                                </Col>
                            </Row>
                            <TextArea rows={2} disabled id='ping_result' />
                        </Card>
                        <Card type="inner" title='指定URL访问检测' bordered={true} style={{ marginBottom: 16 }}>
                            <Row>
                                <Col span={17}>
                                    <FormItem align="left" label='请输入URL地址:' {...formItemLayout}>
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
                                <Col offset={1} span={6}>
                                    <Button type='primary' onClick={this.getPingResult} >时长检测</Button>
                                </Col>
                            </Row>
                            <TextArea rows={2} disabled id='url_result'/>
                        </Card>
                        <Card type="inner" title='网络延时检测' bordered={true} style={{ marginBottom: 16 }}>
                            <Row>
                                <Col span={17}>
                                    <span>
                                        <span>请选择节点</span>
                                        <Select style={{ width: 200, marginLeft: '16px' }} onChange={this.onSelectAsset}>
                                            {assets.map(asset => (
                                                <Option value={asset.uuid}>{asset.name}</Option>
                                            ))}
                                        </Select>
                                    </span>
                                </Col>
                                <Col offset={1} span={6}>
                                    <Button type='primary' onClick={this.getPingResult} >延时检测</Button>
                                </Col>
                            </Row>
                            <br />
                            <TextArea rows={2} disabled id='delay_result'/>
                        </Card>
                        <Card type="inner" title='吞吐量检测' bordered={true} style={{ marginBottom: 16 }}>
                            <Row>
                                <Col span={17}>
                                    <span>
                                        <span>请选择节点</span>
                                        <Select style={{ width: 200, marginLeft: '16px' }} onChange={this.onSelectAsset}>
                                            {assets.map(asset => (
                                                <Option value={asset.uuid}>{asset.name}</Option>
                                            ))}
                                        </Select>
                                    </span>
                                </Col>
                                <Col offset={1} span={6}>
                                    <Button type='primary' onClick={this.getPingResult} >吞吐量检测</Button>
                                </Col>
                            </Row>
                            <br />
                            <TextArea rows={2} disabled id='capacity_result'/>
                        </Card>
                        <Card type="inner" title='通信能力检测' bordered={true} style={{ marginBottom: 16 }}>
                            <Row>
                                <Col span={17}>
                                    <span>
                                        <span>请选择节点</span>
                                        <Select style={{ width: 200, marginLeft: '16px' }} onChange={this.onSelectAsset}>
                                            {assets.map(asset => (
                                                <Option value={asset.uuid}>{asset.name}</Option>
                                            ))}
                                        </Select>
                                    </span>
                                </Col>
                                <Col offset={1} span={6}>
                                    <Button type='primary' onClick={this.getPingResult} >通信能力检测</Button>
                                </Col>
                            </Row>
                            <br />
                            <TextArea rows={2} disabled id='communicate_result' />
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
