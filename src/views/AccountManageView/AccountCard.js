import React from 'react'
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';

import { Card, Form, Select, Input, Tooltip, Icon, Cascader } from 'antd';

import { AccountData, AccountListData } from './AccountData'

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
});

@Form.create()
class AccountCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            // accountIndex: this.props.accindex,
        };
    }

    getAccount() {
        let id = this.props.accindex;
        return AccountData()[id];
    }

    render() {
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
                <Option value={87}>+87</Option>
            </Select>
        );


        let account = this.getAccount();

        return (
            <Card title={account.name}>
                <Card
                    type="inner"
                    title='基本信息'
                >
                    {"账号：" + account.account + "\t\t\t\tID：" + account.index}
                </Card>
                <Card
                    style={{ marginTop: 16 }}
                    type="inner"
                    title="密码"
                    extra={<a href="#">修改密码</a>}
                >
                    密码有效期截止到2022年3月3日23:59
                </Card>
                <Card
                    style={{ marginTop: 16 }}
                    type="inner"
                    title="个人资料"
                    extra={<a href="#">修改</a>}
                >
                    <Form layout='horizontal' style={{ width: '70%', margin: '0 auto' }}>
                        <FormItem label='邮箱' {...formItemLayout}>
                            {
                                getFieldDecorator('email', {
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
                                    <Input />
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
                                getFieldDecorator('nickname', {
                                    rules: []
                                })(
                                    <Input />
                                )
                            }
                        </FormItem>
                        <FormItem label='居住地' {...formItemLayout} required>
                            {
                                getFieldDecorator('residence', {
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
                                    rules: [
                                        {
                                            len: 11,
                                            pattern: /^[1][3,4,5,7,8][0-9]{9}$/,
                                            required: true,
                                            message: '请输入正确的11位手机号码'
                                        }
                                    ]
                                })(
                                    <Input addonBefore={prefixSelector} />
                                )
                            }
                        </FormItem>
                    </Form>
                </Card>
            </Card>
        );
    }
}

AccountCard.propTypes = {
    classes: PropTypes.object,
};

export default withStyles(styles)(AccountCard);
