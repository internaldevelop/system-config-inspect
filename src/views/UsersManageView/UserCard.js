import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { Card, Form, Select, Input, Tooltip, Icon, message, Row, Col } from 'antd';

import ChangePwdDlg from '../../components/ChangePwdDlg';
import HttpRequest from '../../utils/HttpRequest';
import { errorCode } from '../../global/error';

const FormItem = Form.Item;
const Option = Select.Option;

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
        backgroundColor: '#000000',
        opacity: 0.8,
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

    fetchUserCB = (data) => {
        this.setState({ userUuid: this.props.uuid, userInfo: data.payload });
        const { resetFields } = this.props.form;
        resetFields();
    }
    fetchUser = () => {
        HttpRequest.asyncGet(this.fetchUserCB.bind(this), '/users/user-by-uuid', {uuid: this.props.uuid} );
    }

    cancelModifyDetails = () => {
        const { resetFields } = this.props.form;
        resetFields();
        this.setState({ isModifyDetails: !this.state.isModifyDetails });
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

    updateUserDataCB = (data) => {
        this.fetchUser();
    }

    changePassword = () => {
        this.setState({ showChangePwd: true });
    }
    handleCloseChangePwd = (e) => {
        this.setState({ showChangePwd: false });
    }

    activateUserCB = (data) => {
        this.fetchUser();
    }
    activateUser() {
        HttpRequest.asyncPost(this.activateUserCB, '/users/activate', { uuid: this.props.uuid });
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
                        extra={(userInfo.status === 0) && (this.props.manage === 1) && <a onClick={this.activateUser.bind(this)}>激活</a>}
                    >
                        <Row>
                            <Col span={6}>
                                {"账号：" + userInfo.account}
                            </Col>
                            <Col span={14}>
                                {"账号ID：" + userInfo.uuid}
                            </Col>
                            <Col span={4}>
                                {(userInfo.status === 0) && "账户未激活"}
                                {(userInfo.status === 1) && "账户已激活"}
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
                            { "密码有效期截止到：   " + userInfo.expire_time }
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
                {this.state.showChangePwd && <ChangePwdDlg useruuid={this.props.uuid} onclose={this.handleCloseChangePwd.bind(this)} />}
            </div>
        );
    }
}

UserCard.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(UserCard);
