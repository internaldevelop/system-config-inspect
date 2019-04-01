import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Card, Form, Select, Input, Tooltip, Icon, message, Row, Col } from 'antd';
import axios from 'axios';
import Qs from 'qs';

import ChangePwdDlg from '../../components/ChangePwdDlg'
import HttpRequest from '../../utils/HttpRequest'

import { GetBackEndRootUrl } from '../../global/environment'
import { errorCode } from '../../global/error'

const FormItem = Form.Item;
const Option = Select.Option;

const options = [
    {
        label: '湖北',
        value: 'hubei',
        children: [
            {
                label: '武汉',
                value: 'wuhang',
                children: [
                    {
                        label: '蔡甸区',
                        value: 'caidian'
                    },
                    {
                        label: '江夏',
                        value: 'jiangxia'
                    }
                ]
            },
            {
                label: '宜昌',
                value: 'yichang',
                children: [
                    {
                        label: '伍家岗',
                        value: 'wujiagang'
                    },
                    {
                        label: '夷陵区',
                        value: 'yilingqu'
                    },
                    {
                        label: '江南',
                        value: 'jiangnan'
                    },
                    {
                        label: '开发区',
                        value: 'kaifaqu'
                    },
                    {
                        label: 'CBD',
                        value: 'CBD'
                    }
                ]
            }
        ]
    }
]

const styles = theme => ({
    iconButton: {
        margin: 0,
        marginLeft: 10,
    },
    shade: {
        position: 'absolute',
        top: 50,
        left: 0,
        zIndex: 10,
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        opacity: 0.01,
        display: 'block',
    },
});

@Form.create()
class UserCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModifyDetails: false, // false 表示只读状态，true 表示正在修改中，可以保存和取消
            showChangePwd: false,
            userUuid: this.props.uuid,
            userInfo: {}, // 临时保存修改但未提交的用户信息，实际的用户信息保存在 this.props.user
        };
        this.fetchUser();
    }

    fetchUserCB = (payload) => {
        this.setState({ userUuid: this.props.uuid, userInfo: payload });
        const { resetFields } = this.props.form;
        resetFields();
    }
    fetchUser() {
        HttpRequest.asyncGet(this.fetchUserCB.bind(this), '/users/user-by-uuid', {uuid: this.props.uuid} );
    }

    cancelModifyDetails = () => {
        const { resetFields } = this.props.form;
        resetFields();
        this.setState({ isModifyDetails: !this.state.isModifyDetails });
    }

    activateUser() {

    }

    testHttpPostCB(payload) {
        console.log('testHttpPostCB post data, return:');
        console.log(payload);//输出返回的数据
    }
    testHttpPost() {

    }

    modifyDetails = () => {
        let success = true;
        if (this.state.isModifyDetails) {
            this.props.form.validateFields((err, values) => {
                if (err !== null) {
                    success = false;
                } else {
                    const { userInfo } = this.state;
                    let newUserData = {};
                    Object.assign(newUserData, userInfo, values);
                    HttpRequest.asyncPost(this.updateUserDataCB, '/users/update', newUserData);
                }
            });
        }
        if (success)
            this.setState({ isModifyDetails: !this.state.isModifyDetails });
    }

    updateUserDataCB(payload) {
        this.fetchUser();
    }

    changePassword = () => {
        this.setState({ showChangePwd: true });
    }
    handleCloseChangePwd = (e) => {
        this.setState({ showChangePwd: false });
    }

    render() {
        const { userInfo } = this.state;
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
        const prefixSelector = getFieldDecorator('prefix', {
            initialValue: 86,
        })(
            <Select style={{ width: 70 }}>
                <Option value={86}>+86</Option>
                {/* <Option value={87}>+87</Option> */}
            </Select>
        );
        if (this.props.uuid !== this.state.userUuid) {
            // this.setState({ userUuid: this.props.uuid });
            this.fetchUser();
        }

        // The href attribute is required for an anchor to be keyboard accessible. 
        // Provide a valid, navigable address as the href value. If you cannot provide an href, 
        // but still need the element to resemble a link, use a button and change it with appropriate styles.
        return (
            <div>
                <Card title={userInfo.name}>
                    <Card
                        type="inner"
                        title='基本信息'
                        extra={(userInfo.status === 1) && (this.props.manage === 1) && <a onClick={this.testHttpPost.bind(this)}>激活</a>}
                    >
                        <Row>
                            <Col span={8}>
                                {"账号：" + userInfo.account}
                            </Col>
                            <Col span={8}>
                                {"账号ID：" + userInfo.index}
                            </Col>
                            <Col span={8}>
                                {(userInfo.status === 1) && "账户未激活"}
                                {(userInfo.status === 0) && "账户已激活"}
                            </Col>
                        </Row>
                    </Card>
                    <Card
                        style={{ marginTop: 16 }}
                        type="inner"
                        title="密码"
                        extra={(userInfo.status !== 1) && <a onClick={this.changePassword.bind(this)}>修改密码</a>}
                    >
                        <div>
                            密码有效期截止到2022年3月3日23:59
                    </div>
                    </Card>
                    <Card
                        style={{ marginTop: 16 }}
                        type="inner"
                        title="个人资料"
                        extra={
                            <div>
                                <a onClick={this.modifyDetails.bind(this)}>{this.state.isModifyDetails ? "保存" : "修改"}</a>
                                {this.state.isModifyDetails && <a style={{ marginLeft: 10 }} onClick={this.cancelModifyDetails.bind(this)}>{"取消"}</a>}
                            </div>
                        }
                    >
                        <span>
                            <Form layout='horizontal' style={{ width: '70%', margin: '0 auto' }}>
                                {!this.state.isModifyDetails && <div className={classes.shade}></div>}
                                <div>
                                    <FormItem label='邮箱' {...formItemLayout}>
                                        {
                                            getFieldDecorator('email', {
                                                initialValue: userInfo.email,
                                                rules: [
                                                    {
                                                        type: 'email',
                                                        message: '请输入正确的邮箱地址'
                                                    },
                                                    {
                                                        required: true,
                                                        message: '请填写邮箱地址'
                                                    }
                                                ]
                                            })(
                                                <Input allowClear />
                                            )
                                        }
                                    </FormItem>
                                    <FormItem {...formItemLayout} label={(
                                        <span>
                                            昵称&nbsp;
                                        <Tooltip title='请输入您的昵称'>
                                                <Icon type='question-circle-o' />
                                            </Tooltip>
                                        </span>
                                    )}>
                                        {
                                            getFieldDecorator('name', {
                                                initialValue: userInfo.name,
                                                rules: []
                                            })(
                                                <Input allowClear />
                                            )
                                        }
                                    </FormItem>
                                    <FormItem label='居住地' {...formItemLayout} required>
                                        {
                                            getFieldDecorator('address', {
                                                initialValue: userInfo.address,
                                                rules: []
                                            })(
                                                <Input allowClear />
                                                // <Cascader options={options} expandTrigger="hover" placeholder='' />
                                            )
                                        }
                                    </FormItem>
                                    <FormItem label='电话' {...formItemLayout}>
                                        {
                                            getFieldDecorator('phone', {
                                                initialValue: userInfo.phone,
                                                rules: [
                                                    {
                                                        len: 11,
                                                        pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                                                        required: true,
                                                        message: '请输入正确的11位手机号码'
                                                    }
                                                ]
                                            })(
                                                <Input addonBefore={prefixSelector} allowClear />
                                            )
                                        }
                                    </FormItem>
                                </div>
                            </Form>
                        </span>
                    </Card>
                </Card>
                {this.state.showChangePwd && <ChangePwdDlg onclose={this.handleCloseChangePwd.bind(this)} />}
            </div>
        );
    }
}

UserCard.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(UserCard);
