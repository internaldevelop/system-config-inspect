import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Card, Form, Select, Input, Tooltip, Icon, Cascader, Row, Col } from 'antd';

import { SaveAccountData, GetAccountByIndex } from '../../modules/data/account'
import ChangePwdDlg from '../../components/ChangePwdDlg'

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
class AccountCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isModifyDetails: false,
            showChangePwd: false,
            // accountIndex: this.props.accindex,
        };
    }

    getAccount() {
        let id = this.props.accindex;
        return GetAccountByIndex(id);
    }

    cancelModifyDetails = () => {
        const { resetFields } = this.props.form;
        resetFields();
        this.setState({ isModifyDetails: !this.state.isModifyDetails });
    }

    modifyDetails = () => {
        const { resetFields } = this.props.form;
        let success = true;
        const id = this.props.accindex;
        if (this.state.isModifyDetails) {
            this.props.form.validateFields((err, values) => {
                // console.log('Received values of form: ', err, values);
                if (err !== null) {
                    success = false;
                } else {
                    SaveAccountData(id, values);
                    resetFields();
                }
            });
        }
        if (success)
            this.setState({ isModifyDetails: !this.state.isModifyDetails });
    }

    changePassword = () => {
        this.setState({ showChangePwd: true });
    }
    handleCloseChangePwd = (e) => {
        this.setState({ showChangePwd: false });
    }

    render() {
        const { classes } = this.props;
        let accountIndex = this.props.accindex;
        const { getFieldDecorator, getFieldValue } = this.props.form
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


        let account = this.getAccount();

        return (
            <div>
                <Card title={account.name}>
                    <Card
                        type="inner"
                        title='基本信息'
                        extra={(account.status === 1) && (this.props.manage === 1) && <a href="#">激活</a>}
                    >
                        <Row>
                            <Col span={8}>
                                {"账号：" + account.account}
                            </Col>
                            <Col span={8}>
                                {"账号ID：" + account.index}
                            </Col>
                            <Col span={8}>
                                {(account.status === 1) && "账户未激活"}
                                {(account.status === 0) && "账户已激活"}
                            </Col>
                        </Row>
                    </Card>
                    <Card
                        style={{ marginTop: 16 }}
                        type="inner"
                        title="密码"
                        extra={(account.status !== 1) && <a onClick={this.changePassword.bind(this)}>修改密码</a>}
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
                                                initialValue: account.email,
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
                                                initialValue: account.name,
                                                rules: []
                                            })(
                                                <Input allowClear />
                                            )
                                        }
                                    </FormItem>
                                    <FormItem label='居住地' {...formItemLayout} required>
                                        {
                                            getFieldDecorator('address', {
                                                initialValue: account.address,
                                                rules: [
                                                    {
                                                        type: 'array',
                                                        required: true,
                                                        message: '请选择居住地'
                                                    }
                                                ]
                                            })(
                                                <Cascader options={options} expandTrigger="hover" placeholder='' />
                                            )
                                        }
                                    </FormItem>
                                    <FormItem label='电话' {...formItemLayout}>
                                        {
                                            getFieldDecorator('phone', {
                                                initialValue: account.phone,
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
                {this.state.showChangePwd && <ChangePwdDlg accid={accountIndex} onclose={this.handleCloseChangePwd.bind(this)} />}
            </div>
        );
    }
}

AccountCard.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(AccountCard);
